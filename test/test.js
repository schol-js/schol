var assert = require('assert');
var fs = require('fs');
var path = require('path');
const execa = require('execa');
const axios = require('axios');
const output = require('./resources/schol-output');
const diff = require('diff');
const rimraf = require('rimraf');
    
let fixturePath = 'test/resources/example-project';
let testPath = '.tmp';

describe('schol', function () {
  this.timeout(0);
  it('should print a prompt that advises how to use the program and quit with an error', async function () {
    try {
      await execa('node', ['./schol.js']);
    } catch (err) {
      const d = diff.diffLines(err.stderr, output);
      assert(!d.added);
      assert(!d.removed);
    } 
  });

  describe('init', function () {
    let files;

    before(function (done) {
      files = [
        'src/index.md',
        '.gitignore',
        'package.json'
      ];

      rimraf(testPath, function () {
        fs.mkdirSync(testPath);
        process.chdir(testPath);
        execa('node', ['../schol.js', 'init']).then(function () {
          process.chdir('..');
          done();
        });
      });
    });

    it('should initialize a project with a bunch of files', function () {
      let fixtureFiles = files.map(f => {
        return path.resolve(fixturePath, f);
      });
      let testFiles = files.map(f => {
        return path.resolve(testPath, f);
      });
      let diffs = files.map((f, i) => {
        let fixture = fixtureFiles[i];
        let test = testFiles[i];
        /*
         * Newly created files should be the same as the fixture files
         */
        let d = diff.diffLines(fs.readFileSync(fixture).toString(), fs.readFileSync(test).toString());
        assert(!d.added);
        assert(!d.removed);
      });
    });

    after(function (done) {
      rimraf(testPath, done);
    });
  });

  describe('render', function () {
    let files;

    before(function (done) {
      files = [
        'docs/index.html'
      ];

      rimraf(testPath, function () {
        fs.mkdirSync(testPath);
        process.chdir(testPath);
        execa('node', ['../schol.js', 'init']).then(function () {
          execa('node', ['../schol.js', 'render']).then(() => {
            process.chdir('..');
            done();
          });
        });
      });
    });

    it('should successfully render the project', function () {
      let fixtureFiles = files.map(f => {
        return path.resolve(fixturePath, f);
      });
      let testFiles = files.map(f => {
        return path.resolve(testPath, f);
      });
      let diffs = files.map((f, i) => {
        let fixture = fixtureFiles[i];
        let test = testFiles[i];
        /*
         * Newly created files should be the same as the fixture files
         */
        let d = diff.diffLines(fs.readFileSync(fixture).toString(), fs.readFileSync(test).toString());
        assert(!d.added);
        assert(!d.removed);
      });
    });

    after(function (done) {
      rimraf(testPath, done);
    });
  });

  describe('edit', function () {
    let files;
    let response;

    before(function (done) {
      files = [
        'docs/index.html'
      ];

      rimraf(testPath, function () {
        fs.mkdirSync(testPath);
        process.chdir(testPath);
        execa('node', ['../schol.js', 'init']).then(function () {
          let server = execa('node', ['../schol.js', 'edit']);
          process.chdir('..');
          // Grab the rendered page once the server spins up.
          let interval = setInterval(function () {
            axios.get('http://localhost:3000').then(res => {
              response = res;
              // Stop trying
              clearInterval(interval);
              server.kill();
              done();
            }, err => {
              // try again.
            });
          }, 2000);
        });
      });
    });

    it('should successfully render the project', function () {
      let fixtureFiles = files.map(f => {
        return path.resolve(fixturePath, f);
      });
      let testFiles = files.map(f => {
        return path.resolve(testPath, f);
      });
      let diffs = files.map((f, i) => {
        let fixture = fixtureFiles[i];
        let test = testFiles[i];
        /*
         * Newly created files should be the same as the fixture files
         */
        let d = diff.diffLines(fs.readFileSync(fixture).toString(), fs.readFileSync(test).toString());
        assert(!d.added);
        assert(!d.removed);
      });
    });

    it('should serve the rendered project', function () {
      let fixture = path.resolve(fixturePath, files[0]);
      let test = response;
      /*
       * Response should be the same as the fixture files
       */
      let d = diff.diffLines(fs.readFileSync(fixture).toString(), test.toString());
        assert(!d.added);
        assert(!d.removed);
    });

    after(function (done) {
      rimraf(testPath, done);
    });
  });
});