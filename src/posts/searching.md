---
title: "Searching in MacOS"
date: 2019-06-10
---

From [How to find files via the OS X Terminal - CNET](https://www.cnet.com/news/how-to-find-files-via-the-os-x-terminal/)


## Delete temp python files

```bash
$ find . -name '*.pyc' -delete
```

## Other examples
```bash
find /Users -name “test.txt”

```

```bash
locate NAME
```

Or in spotlight

```bash
mdfind NAME 
```


