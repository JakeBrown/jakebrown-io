---
title: Svelte
date: "2020-08-10"
---

## Draft - updated as I'm learning Svelte

I have decent knowledge of React and I'm a day or so into learning Svelte.
My goal was to implement this site in Svelte as simply as possible.
I initially started off with using Sapper - you can check out my source code [here](https://github.com/JakeBrown/jakebrown-io/tree/sapper), or the
original template [here](https://github.com/Charca/sapper-blog-template).

I enjoyed the magic of Sapper but wanted to strip it back as much as possible, so I started with the basic [Svelte template](https://github.com/sveltejs/template) and added routing using [Svelte Routing](https://github.com/EmilTholin/svelte-routing).

This was all pretty easy, but in the docs for Svelte Routing there was no example of retrieving the URL outside of the route components.
This was needed to style the nav according to the current route.

I expected this to work:

```html
<script>
$: url = window.location.pathname
</script>

<header>
  <nav use:links>
    <a class={url == '/' ? 'selected' : ''} href="/">home</a>
    <a class={url == '/about' ? 'selected' : ''} href="/about">about</a>
    <a class={url == '/blog' ? 'selected' : ''} href="/blog">blog</a>
  </nav>
</header>
```

But `url` ends up being non-reactive: it's just the initial url from when the javascript loads.
Probably an obvious gap in my understanding of how [Svelte reactivity](https://svelte.dev/tutorial/reactive-declarations) works.

So I dug a little deeper into the router source code, and I could see that [Link](https://github.com/EmilTholin/svelte-routing/blob/master/src/Link.svelte) implemented url retrieval using contexts, which was a Svelte feature I hadn't learnt about yet. 

This is all I needed:

```html
<script>
  import { LOCATION } from 'svelte-routing/src/contexts.js'
  import { getContext } from 'svelte'
  const locationContext = getContext(LOCATION)
  $: url = $locationContext.pathname
</script>

<header>
  <nav use:links>
    <a class={url == '/' ? 'selected' : ''} href="/">home</a>
    <a class={url == '/about' ? 'selected' : ''} href="/about">about</a>
    <a class={url == '/blog' ? 'selected' : ''} href="/blog">blog</a>
  </nav>
</header>
```

As long as the component calling getContext is inside the `<Router>` component, it works just fine.
