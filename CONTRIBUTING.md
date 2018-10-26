# Contributing Guide

Follow this guide to contribute to schol development.

## Creating new templates

The recommended way to begin creating a new schol template is to clone the [schol-template-default repository](https://github.com/schol-js/schol-template-default). Detailed instructions are available on that repo's readme.

## Developing schol

To get started developing schol, you'll need Git 2.19+, Node 8.12+, a text editor, and a terminal.

Get started by cloning the schol repo and installing its dependencies:

```sh
git clone git@github.com:schol-js/schol.git
cd schol
npm install
```

You can then open the project files in your text editor and hack away. Run `npm test` to run the test suite.

If you want to test your local version of schol from the command line, run `npm link` from within the schol directory. This will link your global `schol` command to your local version of schol.

You may also wish to make changes to [generator-schol](https://github.com/schol-js/generator-schol) -- this is the dependency schol uses to initialize new projects.

### Contributing to the schol repo

Use the following process to contribute back to the schol repo:

1. Fork the [schol repository](https://github.com/schol-js/schol).
2. Create a local clone of your fork.
3. Make, test, and commit your changes.
4. Push your changes back to your fork.
5. [Create a pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) from your fork back to the schol repo.
