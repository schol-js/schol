#!/usr/bin/env node

/**
 * Module dependencies.
 */

var schol = require('commander');

const pkg = require('./package.json');

schol.version(pkg.version);

schol
  .command('init')
  .description('Initializes a new schol project in the current directory.')
	.action(function (env, options) {
		var yeoman = require('yeoman-environment');
		var yoEnv = yeoman.createEnv();
		yoEnv.register(require.resolve('generator-schol'), 'schol');
		yoEnv.run('schol');
	});

schol
  .command('edit')
  .description('Opens your project in your web browser and watches for changes to the project. Automatically rebuilds the project and refreshes the browser when changes are detected.')
  .action(function (env, options) {
  	const gulp = require('gulp');
  	const frontMatter = require('gulp-front-matter');
  	gulp.src('src/**/*.md')
  	  .pipe(frontMatter())
  	  .
  	const md = require('markdown-it');

  });

schol
  .command('render')
  .description('Generates a distributable and/or publishable version of your project in the docs/ folder.')
  .action(function (env, options) {
  	// Get all our source files
  	// Handle documents
  	// ? Download and install any necessary templates ?
  	// Parse citations
  	// Output any other files directly
  	var md = require('markdown-it')();
		var result = md.render('# markdown-it rulezz!');
  });
;

schol
  .command('publish')
  .description('Publishes the most recently rendered version of the project to GitHub Pages.')
  .action(function (env, options) {
		console.log('test')
	});

schol.parse(process.argv);

module.exports = schol;