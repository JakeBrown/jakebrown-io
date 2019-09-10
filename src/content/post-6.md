---
title: "Git"
date: "2019-06-06"
draft: false
path: "/blog/git"
---

## merge
The *merge* command is used to integrate changes from another *branch*. The target of this integration (i.e. the *branch* that receives changes) is always the currently checked out HEAD *branch*. 
```
git merge xxx
```
<br>
<hr>

## delete tag
Delete local and remote tag:

From [here](https://nathanhoad.net/how-to-delete-a-remote-git-tag/)

```sh
git tag -d 12345
git push origin :refs/tags/12345
```
