# `schol`

`schol` is a command line tool that makes it easy to write academic documents in Markdown, manage citations, and publish your work to the web.

## Why schol?

Why should you use schol? What does schol have that other systems don't?

 - schol's default output format is mobile and web friendly
 - schol makes managing citations easy
 - schol lets you publish your work to the web with a single command
 - schol is built with Node.js and npm, making it cross-platform and easy to install and extend
 - schol lets you author your work in Markdown

## <a name="#requirements">System Requirements</a>

You can use schol on any machine with the following:

 - Node.js 8.11 or later
 - Your favorite text editor (Sublime Text, Atom, VSCode, etc.)
 - Your favorite terminal (CMD, PowerShell, Hyper, iTerm2, zsh, bash, etc.)
 - A modern web browser (Chrome, Edge, Firefox, Opera, Safari, etc.)
 - Git (Optional. For publishing to GitHub Pages)

This includes all modern varieties of Windows, MacOS, and Linux.

## Installation

To install schol, run the following in your terminal:

```sh
npm install -g schol
```

## Getting Started

Let's start a new `schol` project. Create a new folder for the project, navigate into it, and initialize the project:

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

Next, start schol in edit mode:

```sh
schol edit
```

This will display your assignment in your web browser and automatically reload it whenever you save any changes. schol will continue to run in edit mode indefinitely until you stop it (Ctrl + W, closing the terminal, etc.). You might want to open a new terminal window to run other commands.

Make some changes to `src/index.md` in your editor and save them. Your browser will automatically reload with the latest changes.

Once you are finished your work, render the final output files:

```sh
schol render
```

This will save a copy of your finished work and all necessary files to the `docs/` folder in your project directory. Distribute these files however you want -- for example, submit them for grading or review, or upload them to a website.

To use `schol` to publish your work to [GitHub Pages free web hosting service](](https://pages.github.com/):

1. [Create a new GitHub repository and push your project to it.](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)
2. Run `schol publish`
3. [Set up your GitHub repository to publish from the `docs/` folder in your project.](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)

Your work is now published to the web.

## Features

### Front Matter Metadata

schol documents generally begin with a front matter section:

```yaml
title: The Impact of Bees on Hives
authors:
  - name:  John Smith
    email: john.smith@university.com
date: 2018-09-01
---
```

This section is used to define document metadata. Some of this metadata is used internally by schol when it prepares your document. This includes:

- The `template` property
- The `references` property
- The `citation-style` property

Other properties may be defined and used by templates.

### Templates

Every schol document has a template that determines how it is rendered. Specify it with the `template` property in the front matter of the document:

```markdown
template: ./my-assignment-template/
```

If no `template` is specified, the [default schol template] is used.

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

### Content

Author your content in [CommonMark markdown](https://spec.commonmark.org/0.28/) immediately following the front matter of your document:

```markdown
author: Jamie Czerwinski
---
# Introduction

Lorem ipsum...

```

schol parses your content with [markdown-it](https://github.com/markdown-it/markdown-it) and inserts it into your template for rendering.

### Citation Management

schol appends your references to the end of your document, so remember to add a "References" or "Bibliography" header as the last line of your content:

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

Citation labels require references entries in your document front matter:

```yaml
references:
    citation-label: http://www.some-citation.com
```

A references entry can be:

1. A URL
2. [Anything accepted by Citation.js](https://citation.js.org/api/tutorial-input_formats.html)

For URL references, schol will attempt to automatically parse citation data from the page.

If unsuccessful, schol will print a warning and treat the citation as a URL without any citation metadata (eg. title, author, etc.). The citation will still appear in your references, but it will show minimal information.

If this happens, you can either leave it as is, find a URL for the resource you are citing that includes embedded citation data, or manually add the citation data to your references.

#### Citation Styles

You can specify the citation format to use in your document with the `citation-style` front matter property -- just specify the ID of any style in the [Zotero Style Repository](https://www.zotero.org/styles). To get the ID of a style from the Zotero Style Repository, hover over any style in the list and click the "Link" link that appears to the right of the style's date. The ID will appear in the Style Search bar -- exclude the `id:` part:

```yaml
citation-style: apa-5th-edition
```

If no `citation-style` is specified, schol defaults to `apa-5th-edition`.

## CLI Reference

### `schol init`

Initializes a new schol project in the current directory.

### `schol edit`

Opens your project in your web browser and watches for changes to the project. Automatically rebuilds the project and refreshes the browser when changes are detected.

### `schol render`

Generates a distributable and/or publishable version of your project in the `docs/` folder.

### `schol publish`

Publish the most recently rendered version of the project to GitHub Pages. Will not publish changes made following the most recent execution of `schol render`.

This command requires a GitHub repository be set up for this project. Follow these steps to ensure `schol publish` works properly:

1. [Create a new GitHub repository and push your project to it.](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)
2. Run `schol publish`
3. [Set up your GitHub repository to publish from the `docs/` folder in your project.](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)
