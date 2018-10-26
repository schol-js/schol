#!/usr/bin/env node

/**
 * Module dependencies.
 */

let path = require('path');
let minimatch = require('minimatch');
let schol = require('yargs');
let Citation;

/**
 * Root level command
 */
schol
  .scriptName('schol')
  .demandCommand(1, 'Choose a command and run schol [command] to proceed.')
  .recommendCommands();

/**
 * schol init
 */
schol
  .command({
    command: 'init',
    desc: 'Initialize a new schol project',
    builder: yargs => {
      return yargs
        .option('template', {
          alias: 't',
          describe: 'schol template to use for this project. Can be a local path or a node module.',
          type: 'string',
          default: 'schol-template-default'
        });
    },
    handler: (argv) => {
      var yeoman = require('yeoman-environment');
      var yoEnv = yeoman.createEnv();
      yoEnv.register(require.resolve('generator-schol'), 'schol:app');
      yoEnv.run('schol:app', argv);
    }
  })
/**
 * schol edit
 */
  .command({
    command: 'edit',
    desc: 'Reload your project in your web browser as you save changes.',

    handler: () => {
      Citation = require('citation-js');
      getMetalsmith()
        .use(require('metalsmith-browser-sync')({
          server: 'docs',
          files: ['src/**/*', 'node_modules/**/*']
        }))
        .build(err => {
          if (err) throw err;
        });
    }
  })
/**
 * schol render
 */
  .command({
    command: 'render',
    desc: 'Generates a distributable and/or publishable version of your project in the docs/ folder.',
    handler: () => {
      Citation = require('citation-js');
      getMetalsmith()
        .build(err => {
          if (err) throw err;
        });
    }
  }).argv;

module.exports = schol;

/**
 * Metalsmith middleware for processing citations
 */
function cite (files, smith, done) {
  let axios = require('axios');

  let filenames = Object.keys(files)
    // Only include markdown files
    .filter(minimatch.filter('**/*.md'));
    
  let config = Citation.plugins.config.get('csl');
  let bundledStyles = config.templates.data;
  let customStyles = {};
  let engine = config.engine;
  filenames
    .forEach(filename => {
      file = files[filename];

      // Register the citation style. Default to apa
      const style = file.citation_style || 'apa';
      const url = `https://www.zotero.org/styles/${style}`;
      file.citation_style = style;

      let refs = file.references || {};

      // For styles that are bundled with citation.js, just build the bibliography.
      if (bundledStyles[style]) {
        file.bibliography = buildBibliography(refs);

        // see https://github.com/Juris-M/citeproc-js/blob/master/manual/citeproc-doc.rst#return-value
        // also https://github.com/larsgw/citation.js/blob/61880bc6599393bce4368af200668a5846ccac3c/src/get/modules/csl/engines.js#L72
        file.cslFormat = getCslFormat(engine, style);
      }

      // For styles that aren't bundled, first check if we're trying to grab them
      else if (customStyles[style]) {
        customStyles[style].then(() => {
          file.bibliography = buildBibliography(refs);
          file.cslFormat = getCslFormat(engine, style);
        });
      }

      // We haven't tried to grab this style yet. Let's grab it, register it, and build the bibliography.
      else {
        customStyles[style] = axios.get(url).then(r => {
          const stylesheet = r.data;
          config.templates.add(style, stylesheet);
          file.bibliography = buildBibliography(refs);
          file.cslFormat = getCslFormat(engine, style);
        }).catch(err => {
          console.log(`Error getting ${style} from ${url} for ${filename}. Using 'apa' instead.`)
        });
      }
    });

  axios
    .all(Object.values(customStyles))
    .then(() => {
      setImmediate(done);
    });
}

/**
 * Metalsmith middleware to process markdown
 */
function markdown (files, metalsmith, done) {
  let markdownIt = require('markdown-it');
  let citations = require('./markdown-it-citations');
  let anchors = require('markdown-it-anchor');
  let toc = require('markdown-it-toc-done-right');

  let md = markdownIt()
    .use(citations)
    .use(anchors, {permalink: true})
    .use(toc);
  
  Object.keys(files).filter(minimatch.filter('**/*.md')).forEach(filename => {
    let file = files[filename];
    file.contents = new Buffer(md.render(file.contents.toString(), file));
  });
  setImmediate(done);
}

/**
 * Helper to build bibliography
 */
function buildBibliography (refs) {
  let bibliography = new Citation();

  Object.keys(refs).forEach((ref, idx) => {

    // Add the reference to the bibliography
    bibliography.add(refs[ref]);
    let entry = bibliography.data[idx];

    // Copy the original reference to the bibliography entry
    entry._original = refs[ref];

    // Point the reference to the bibliography entry
    refs[ref] = entry;

    // Set the ID on the bibliography entry to the reference label
    entry.id = ref;
  });

  return bibliography;
}

/**
 * 
 * Helper to generate formatting parameters for the template. Required for spacing, indentation, etc.
 *
 * Adapted from  https://github.com/Juris-M/citeproc-js/blob/master/manual/citeproc-doc.rst#return-value
 * 
 * Also https://github.com/larsgw/citation.js/blob/61880bc6599393bce4368af200668a5846ccac3c/src/get/modules/csl/engines.js#L72
 * 
 */
function getCslFormat (engine, style) {
  let format = engine([], style, 'en-US', 'html').makeBibliography()[0];
  format.maxoffset = Math.max(1, format.maxoffset -2);
  format.linespacing = Math.max(format.linespacing, 1.35);
  return format;
}

/**
 * Helper to get metalsmith instance. Ensures the base instance is the same between commands
 */
function getMetalsmith () {
  let Metalsmith = require('metalsmith');

  let ms = Metalsmith(process.cwd())
    .destination('docs')
    .use(cite)
    .use(markdown)
    .use(require('./layouts')({
      default: 'schol-template-default',
      directory: 'template',
      pattern: '**/*.md'
    }))
    // Rename md to html
    .use(require('metalsmith-rename')([[/.md$/, '.html']]));

  return ms;
}