#!/usr/bin/env node

/**
 * Module dependencies.
 */

var schol = require('commander');

const package = require('./package.json');

schol.version(package.version);
schol.command('init', 'Initializes a new schol project in the current directory.').action(function (env, options) {

});
schol.command('render', 'Generates a distributable and/or publishable version of your project in the docs/ folder.');
schol.command('edit', 'Opens your project in your web browser and watches for changes to the project. Automatically rebuilds the project and refreshes the browser when changes are detected.');
schol.command('publish', 'Publishes the most recently rendered version of the project to GitHub Pages.');
schol.parse(process.argv);

module.exports = schol;