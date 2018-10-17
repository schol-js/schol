# [![schol](media/schol.png)](https://github.com/schol-js/schol)

> Academic writing made easy.

schol is a command line tool that makes it easy to write academic documents in Markdown, automatically manage and format citations, and publish your work to the web.

## Contents

 - [Why schol?](#why-schol)
 - [System Requirements](#system-requirements)
 - [Installation](#installation)
 - [Getting Started](#getting-started)
 - [Features](#features)
   - [Templates and Front Matter Metadata](#templates-and-front-matter-metadata)
   - [Content](#content)
   - [Citation Management](#citation-management)
   - [Citation Styles](#citation-styles)
 - [CLI Reference](#cli-reference)
 - [Credits](#credits)


## Why schol?

 - Mobile accessible output
 - Built in citation management with automatic formatting
 - Easy publishing to GitHub Pages
 - Cross-platform and easy to install

## System Requirements

 - Node.js 8.12 or later
 - Your favorite text editor (Sublime Text, Atom, VSCode, etc.)
 - Your favorite terminal (CMD, PowerShell, Hyper, iTerm2, zsh, bash, etc.)
 - A modern web browser (Chrome, Edge, Firefox, Opera, Safari, etc.)
 - Git (For publishing to GitHub Pages)

## Installation

To install `schol`, run the following in your terminal:

```sh
npm install -g schol
```

## Getting Started

To start a new `schol` project, create a new folder for the project, navigate into it, and initialize the project with `schol init`:

```sh
mkdir assignment
cd assignment
schol init
```

Next, open the directory in your text editor. For example, if you're using Sublime Text:

```sh
subl .
```

You can then open `src/index.md` in your editor -- this is where you will save your work.

Next, start `schol` in edit mode:

```sh
schol edit
```

This will display your assignment in your web browser and automatically reload it whenever you save any changes. `schol` will continue to run in edit mode indefinitely until you stop it (Ctrl + W, closing the terminal, etc.). You might want to open a new terminal window to run other commands.

Make some changes to `src/index.md` in your editor and save them. Your browser will automatically reload with the latest changes.

Once you are finished your work, render the final output files:

```sh
schol render
```

This will save a copy of your finished work and all necessary files to the `docs/` folder in your project directory. Distribute these files however you want -- for example, submit them for grading or review, or upload them to a website for publication.

To use `schol` to publish your work to [GitHub Pages free web hosting service](](https://pages.github.com/):

1. [Create a new GitHub repository and push your project to it.](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)
2. Run `schol publish`
3. [Set up your GitHub repository to publish from the `docs/` folder in your project.](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)

Your work is now published to the web.

## Features

### Templates and Front Matter Metadata

Every `schol` document has a template that determines how it is rendered. Specify your document template with the `template` property in your document:

```yaml
template: ./my-assignment-template/
```

If no `template` is specified, [schol-template-default] is used.

Templates embed document metadata like title and author details into their rendered output. Specify document metadata with a front matter section in your document:

```yaml
title: The Impact of Bees on Hives
authors:
  - name:  John Smith
    email: john.smith@university.com
date: 2018-09-01
---
```

Different templates may require different front matter. For example, a template for a course assignment might require the following front matter:

```yaml
assignment-name: Assignment 2
authors:
  - name: Jamie Czerwinski
    email: jamie.czerwinski@gmail.com
course-number: COMP 693
course-name: Independent Study
teacher: Dr. Maiga Chang
school: Athabasca University
date: 2018-08-31
```

The template will then render these values into a title section for your assignment.

Read the documentation for the template you are using to learn what metadata it requires.

### Content

Author your content in [CommonMark markdown](https://spec.commonmark.org/0.28/) immediately following the front matter of your document:

```markdown
author: Jamie Czerwinski
---

# Introduction

Lorem ipsum...

```

`schol` parses your content with [markdown-it](https://github.com/markdown-it/markdown-it) and inserts it into your template for rendering.

### Citation Management

`schol` appends your references to the end of your document, so remember to add a "References" or "Bibliography" header as the last line of your content:

```markdown
...

# Conclusion

Lorem ipsum ... and more research is needed.

# References

*schol will append your references here*
```

To make a citation, use a bracketed caret symbol and citation label:

```markdown
According to this citation,[^citation-label] ...
```

Make sure that each citation has a `references` entry in your document front matter:

```yaml
references:
    citation-label: http://www.some-citation.com
```

A reference entry can be:

1. A URL
2. [Anything accepted by Citation.js](https://citation.js.org/api/tutorial-input_formats.html)

For URL references, `schol` will attempt to automatically parse citation data from the page.

If unsuccessful, `schol` will print a warning and treat the citation as a URL without any citation metadata (eg. title, author, etc.). The citation will still appear in your references, but it will show minimal information.

If this happens, you can either leave it as is, find a URL for the resource you are citing that includes embedded citation data, or manually add the citation data to your references.

#### Citation Styles

You can specify the citation format to use in your document with a `citation_style` property in your document's front matter -- just specify the ID of any style in the [Zotero Style Repository](https://www.zotero.org/styles).

To get the ID of a style from the Zotero Style Repository, hover over any style in the list and click the "Link" link that appears to the right of the style's date. The ID will appear in the Style Search bar -- exclude the `id:` part:

```yaml
citation_style: apa-5th-edition
```

If no `citation_style` is specified, `schol` defaults to `apa-5th-edition`.

## CLI Reference

### `schol init`

Initializes a new `schol` project in the current directory.

### `schol edit`

Opens your project in your web browser and watches for changes to the project. Automatically rebuilds the project and refreshes the browser when changes are detected. Does the same thing as `schol render`, but rebuild the project as changes happen in real-time.

### `schol render`

Generates a distributable and/or publishable version of your project in the `docs/` folder.

### `schol publish`

Publish the most recently rendered version of the project to GitHub Pages. Will not publish changes made following the most recent execution of `schol render` or `schol edit`.

This command requires a GitHub repository be set up for this project. Follow these steps to ensure `schol publish` works properly:

1. [Create a new GitHub repository and push your project to it.](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)
2. Run `schol publish`
3. [Set up your GitHub repository to publish from the `docs/` folder in your project.](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)

## Credits

### Contributors

[![jczerwinski](https://github.com/jczerwinski.png?size=100)](http://github.com/jczerwinski)
