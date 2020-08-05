---
title: "Kubectl"
date: "2019-06-10"
draft: false
path: "/blog/kubectl"
---

Some snippets for interacting with kubectl...

Edit a live deployment:

```bash
kubectl edit deployment xxx
```

Apply from stdin:

```bash
cat kube/postgres.yaml.jinja | kubectl apply -f -
```
