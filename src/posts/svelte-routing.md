---
title: Svelte Routing
date: '2020-08-10'
---

I use React in my day-to-day work and I'm learning Svelte for fun, so my goal was to implement this site in Svelte as simply as possible.
I decided against Sapper, and instead started with the standard [Svelte template](https://github.com/sveltejs/template) and added routing using [Svelte Routing](https://github.com/EmilTholin/svelte-routing).

This was all pretty easy, but the docs for Svelte Routing contained no example where the current URL was used outside of the `Route` components.
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

I expected this to work without issue, so there's probably an obvious gap in my understanding of how [Svelte reactivity](https://svelte.dev/tutorial/reactive-declarations) works.
What happens? Well `url` is just the initial url from when the javascript loads.

So I dug a little deeper into the svelte-routing source code, and I could see that [`<Link>`](https://github.com/EmilTholin/svelte-routing/blob/master/src/Link.svelte) implemented URL retrieval using `contexts`, which was a Svelte feature I hadn't learnt about yet.
I just needed to tap into this context.

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

I'm not sure why svelte-routing doesn't discuss this.
While the solution is simple, it's also non-documented and presumably not part of the official API, so it could change without notice.
I'm fine using such a solution on this toy project.
But on a production site? There might be a better option out there.

## Other options

What about tapping in to the browser's API to keep track of the URL ourselves?
Let's immediately disregard polling as an option because that seems like a messy hack.
Are there any browser events we can listen to?

There's [this](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event):

```javascript
window.onpopstate = function (event) {
  console.log(
    'location: ' +
      document.location +
      ', state: ' +
      JSON.stringify(event.state),
  )
}
```

One problem:

> Note that just calling history.pushState() or history.replaceState() won't trigger a popstate event. The popstate event will be triggered by doing a browser action such as a click on the back or forward button (or calling history.back() or history.forward() in JavaScript).

So we're going to miss any of the navigation that happens within our app.
Unfortunately, it doesn't look like there are any other options, so we're stuck with tapping in to the svelte-routing context for now.

## Links

- [Original Sapper template](https://github.com/Charca/sapper-blog-template)
- [This site using Sapper](https://github.com/JakeBrown/jakebrown-io/tree/sapper)
- [This site using svelte-routing](https://github.com/JakeBrown/jakebrown-io)
