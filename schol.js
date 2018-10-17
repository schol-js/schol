#!/usr/bin/env node

/**
 * Module dependencies.
 */
 
let Metalsmith = require('metalsmith');
let transform = require('metalsmith-in-place');
let Citation = require('citation-js');
let markdownIt = require('markdown-it');
let markdownItCitations = require('./markdown-it-citations');
let minimatch = require('minimatch');
let axios = require('axios');

var schol = require('commander');

const pkg = require('./package.json');

schol.version(pkg.version);

let ms = Metalsmith(process.cwd())
  .destination('docs')
  .use(cite)
  .use(markdown)
  .use(require('./layouts')({
    default: 'schol-template-default',
    directory: 'templates',
    pattern: '**/*.md'
  }))
  // Rename md to html
  .use(require('metalsmith-rename')([[/.md$/, '.html']]));

schol
  .command('init')
  .description('Initializes a new schol project in the current directory.')
  .option('-c, --citation_style', 'Citation style')
  .option('-t, --template', 'Template')
  .action(function (env, options) {
    var yeoman = require('yeoman-environment');
    var yoEnv = yeoman.createEnv();
    yoEnv.register(require.resolve('generator-schol'), 'schol');
    yoEnv.run('schol', options);
  });

schol
  .command('edit')
  .description('Opens your project in your web browser and watches for changes to the project. Automatically rebuilds the project and refreshes the browser when changes are detected.')
  .action(function (env, options) {
    ms
      .use(require('metalsmith-browser-sync')({
        server: 'docs',
        files: ['**/*']
      }))
      .build(err => {
        if (err) throw err;
      });
  });

schol
  .command('render')
  .description('Generates a distributable and/or publishable version of your project in the docs/ folder.')
  .action(function (env, options) {
    ms
      .build(err => {
        if (err) throw err;
      });
  });

schol
  .command('publish')
  .description('Publishes the most recently rendered version of the project to GitHub Pages.')
  .action(function (env, options) {
		console.log('test')
	});

schol.parse(process.argv);

if (!process.argv.slice(2).length) {
  schol.outputHelp();
}

module.exports = schol;

function cite (files, smith, done) {
  let filenames = Object.keys(files)
    // Only include markdown files
    .filter(minimatch.filter('**/*.md'))
    // Exclude files without references
    .filter(file => files[file].references);
    
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

      // For styles that are bundled with citation.js, just build the bibliography.
      if (bundledStyles[style]) {
        file.bibliography = buildBibliography(file.references);
        // see https://github.com/Juris-M/citeproc-js/blob/master/manual/citeproc-doc.rst#return-value
        // also https://github.com/larsgw/citation.js/blob/61880bc6599393bce4368af200668a5846ccac3c/src/get/modules/csl/engines.js#L72
        file.cslFormat = getCslFormat(engine, style);
      }

      // For styles that aren't bundled, first check if we're trying to grab them
      else if (customStyles[style]) {
        customStyles[style].then(() => {
          file.bibliography = buildBibliography(file.references);
          file.cslFormat = getCslFormat(engine, style);
        });
      }

      // We haven't tried to grab this style yet. Let's grab it, register it, and build the bibliography.
      else {
        customStyles[style] = axios.get(url).then(r => {
          const stylesheet = r.data;
          config.templates.add(style, stylesheet);
          file.bibliography = buildBibliography(file.references);
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

function markdown (files, metalsmith, done) {
  let md = markdownIt()
    .use(markdownItCitations);
  
  Object.keys(files).filter(minimatch.filter('**/*.md')).forEach(filename => {
    let file = files[filename];
    file.contents = new Buffer(md.render(file.contents.toString(), file));
  });
  setImmediate(done);
}

function buildBibliography (references) {
  let bibliography = new Citation();

  let refs = file.references;
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
 * Generate formatting parameters for the template. Required for spacing, indentation, etc.
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
