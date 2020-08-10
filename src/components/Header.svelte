<style>
  header {
    display: flex;
    margin: 0 auto;
    max-width: 1400px;
    padding: 2em;
    width: 100%;
  }

  nav {
    align-items: flex-end;
    display: flex;
    flex: 1;
    font-family: Rubik, sans-serif;
    font-weight: 700;
    justify-content: flex-end;
    text-transform: uppercase;
  }

  a {
    color: inherit;
    text-decoration: none;
    padding: 10px 5px;
    display: block;
    position: relative;
    margin-left: 20px;
  }

  a:not(.selected) {
    opacity: 0.7;
  }

  a::before {
    content: '';
    position: absolute;
    transition: transform 0.3s ease;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #aaa;
    transform: scaleX(0);
  }

  a:hover::before,
  .selected::before {
    transform: scaleX(1);
  }

  .selected::before {
    background: #fd6378;
  }

  .hidden {
    visibility: hidden;
  }
</style>

<script>
  import Logo from './Logo.svelte'
  import { links } from 'svelte-routing'
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
