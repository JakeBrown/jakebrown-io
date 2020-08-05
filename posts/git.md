---
title: "Git"
date: "2019-06-06"
---

## merge

The _merge_ command is used to integrate changes from another _branch_. The target of this integration (i.e. the _branch_ that receives changes) is always the currently checked out HEAD _branch_.

```bash
git merge xxx
```

## delete tag

Delete local and remote tag:

From [here](https://nathanhoad.net/how-to-delete-a-remote-git-tag/)

```bash
git tag -d 12345
git push origin :refs/tags/12345
```

## rebase

```bash
git rebase -i <after-this-commit>
```

and replace “pick” on the second and subsequent commits with “squash” or “fixup”, as described in the manual.

In this example, <after-this-commit> is either the SHA1 hash or the relative location from the HEAD of the current branch from which commits are analyzed for the rebase command.

For example, if the user wishes to view 5 commits from the current HEAD in the past the command is git rebase -I HEAD~5

## checkout only file/directory from branch

```bash
git checkout feature-branch -- src/js/some-file.js
```
