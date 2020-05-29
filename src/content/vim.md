---
title: "Vim and CoC"
date: "2020-06-29"
draft: false
path: "/blog/vim"
---

I've been hooked on the fluidity and responsiveness of Vim since 2013. 
Sure, I've used IntelliJ for mammoth Java projects - It just feels safer with the built-in refactoring support, but Vim has been my go-to for everything else

I've tried other lightweight editors, usually after watching a tutorial and being reminded about all the flashy plugins for Visual Studio Code.
But every time I have tried to switch, I longed for the snappiness of Vim.
And although Vim-mode plugins for various editors still allowed me to use my hard-fought muscle memory, it always seemed like a second-rate imitation.

CoC comes pretty close to providing a nice IDE-like experience in Vim, so maybe that is the better trade-off for me..


## Handy commands for COC

- gd - go to definition
- ctrl-o - return (:help jumplist)
- :CocConfig - will bring up the coc json config file
- :CocList snippets - list snippets for current file type


## Getting python linting working:

We need to make sure it picks the right interpreter. To do this, do:

```
:CocCommand python.setInterpreter
```

And pick the interpreter.

It also needs to pick the correct workspace file. You can do it manually like:
- Run :CocList folders.
- Press <cr> and edit the path to correct folder.
- Run :CocRestart to restart service.
- Save a session file to persist workspaceFolders.
- (https://github.com/neoclide/coc-python/issues/26)

But that’s a pain because you need to manually do it each time.
Instead, we have set our coc-config to look for Pipfile and package.json since they will work well in our monorepo.

More info [here](https://github.com/neoclide/coc.nvim/wiki/Using-workspaceFolders).


## CoC Config

We can always do :CocLocalConfig and put a settings file in each project if we need to.


## Terminal escape key
Ctrl-w


## Relative line numbers

https://www.google.com.au/amp/s/jeffkreeftmeijer.com/vim-number/amp.html

```sh
:set number relativenumber

:augroup numbertoggle
:  autocmd!
:  autocmd BufEnter,FocusGained,InsertLeave * set relativenumber
:  autocmd BufLeave,FocusLost,InsertEnter   * set norelativenumber
:augroup END
```
