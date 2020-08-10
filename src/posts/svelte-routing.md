---
title: Svelte Routing
date: '2020-08-10'
---

I'm a day or so into learning Svelte, going in with a decent knowledge of React.
My goal was to implement this site in Svelte as simply as possible.
I initially started off with using Sapper but wanted to strip it back as much as possible, so I started with the basic [Svelte template](https://github.com/sveltejs/template) and added routing using [Svelte Routing](https://github.com/EmilTholin/svelte-routing).

This was all pretty easy, but the docs for Svelte Routing contained no example of using the current URL outside of the `Route` components.
This was needed to style the `nav` appropriately.

This was my first attempt:

```html
<script>
$: url = window.location.pathname
</script>

<header>
  <nav use:links>
    <a class={url == '/' ? 'selected' : ''} href="/">home</a>
    <a class={url == '/about' ? 'selected' : ''} href="/about">about</a>
  </nav>
</header>
```

But `url` ends up being non-reactive: it's just the initial url from when the javascript loads.
Given that I expected it to work, there's probably an obvious gap in my understanding of how [Svelte reactivity](https://svelte.dev/tutorial/reactive-declarations) works.

So I dug a little deeper into the svelte-routing source code, and I could see that [`<Link>`](https://github.com/EmilTholin/svelte-routing/blob/master/src/Link.svelte) implemented URL retrieval using `contexts`, which was a Svelte feature I hadn't learnt about yet.

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
  </nav>
</header>
```

As long as the component calling `getContext` is inside the `<Router>` component, it works just fine.

## Links

- [Original Sapper template](https://github.com/Charca/sapper-blog-template)
- [This site using Sapper](https://github.com/JakeBrown/jakebrown-io/tree/sapper)
- [This site using svelte-routing](https://github.com/JakeBrown/jakebrown-io)
