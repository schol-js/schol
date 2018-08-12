schol is a command line tool that makes it easy to write academic documents in Markdown, manage citations, and publish your work to the web.

## Why schol?

Why should you use schol? What does schol have that other systems don't?

 - schol's default output format is mobile web friendly -- who uses paper anymore?
 - schol makes managing citations *ridiculously* easy.
 - schol lets you publish your work to the web with a single command.
 - schol is built with Node.js and npm, making it cross-platform and easy to install and extend.
 - schol lets you author your work in Markdown.
 - schol makes it easy to create, use, and share templates.

## System Requirements

You can use schol on any machine with the following:

 - Node.js 8.11 or later
 - Your favorite text editor (Sublime Text, Atom, VSCode, etc.)
 - Your favorite terminal (CMD, PowerShell, Hyper, iTerm2, zsh, bash, etc.)

This includes all modern varieties of Windows, MacOS, and Linux.

## Installation

To install Schol, run the following in your terminal:

```sh
npm install -g schol
```

That's it!

## Getting Started

Let's start a new schol project. Create a new folder for the project, navigate into it, and initialize a new schol project:

```sh
mkdir assignment
cd assignment
schol init
```

Next, open the directory in your text editor. For example, if we're using Sublime Text:

```sh
subl .
```

You can then open `src/index.md` in your editor -- this is where you will save your assignment.

Next, start schol in edit mode:

```sh
schol edit
```

This will display your assignment in your web browser and automatically reload it whenever you save any changes. schol will continue to run in edit mode indefinitely until you stop it (Ctrl + W, closing the terminal, etc.). You might want to open a new terminal window to run other commands.

Now, make some changes to `src/index.md` in your editor and save them. Your browser will automatically reload with the latest changes.



How would a user get started using the system?
Does it outline a basic use case of all the system's major features?
Does it illustrate a common real-world scenario?




Documentation
30 marks

Detailed documentation of every feature of the system, including:

A description of the feature
How to access/use the feature
Example usage of the feature
How the feature works