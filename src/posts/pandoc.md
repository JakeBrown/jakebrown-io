---
title: Pandoc
date: '2020-08-19'
---

To convert Markdown to PDF, you can use Pandoc:

```bash
pandoc -o out.pdf report.md
```

This requires basictex to be installed:

```bash
brew cask install basictex
```

To watch the files and re-render in real time:

```bash
nodemon -e md --exec "pandoc -o out.pdf report.md"
```
