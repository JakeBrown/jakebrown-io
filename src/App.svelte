<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    min-height: 100vh;
  }

  main {
    flex: 1;
    position: relative;
    margin: 0 auto;
    max-width: 1400px;
    background-color: white;
    padding: 1em 2em;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  footer {
    color: #fd6378;
    font-size: 1em;
    font-family: Rubik, sans-serif;
    margin: 1em auto;
    max-width: 1400px;
    padding: 1em 2em;
    text-align: center;
    width: 100%;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<script>
  import { Router, Link, Route } from 'svelte-routing'
  import Header from './components/Header.svelte'
  import Blog from './Blog.svelte'
  import About from './About.svelte'
  import Index from './Index.svelte'
  import Post from './Post.svelte'
  import Error from './Error.svelte'
  import all from './posts/*.md'
  let posts = all
    .map((post) => ({ ...post, html: post.html.replace(/^\t{3}/gm, '') }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  let startUrl = window.location.pathname

  function findPost(slug) {
    var found = posts.find(function (element) {
      return element.slug == slug
    })
    return found
  }
</script>

<div class="layout">
  <Router url={startUrl}>
    <Header />
    <main>
      <Route path="/blog/:slug" let:params>
        {#if findPost(params.slug)}
          <Post post={findPost(params.slug)} />
        {:else}
          <Error status="404" message="Blog post not found" />
        {/if}
      </Route>
      <Route path="/blog">
        <Blog {posts} />
      </Route>
      <Route path="/">
        <Index />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route>
        <Error status="404" message="Page not found" />
      </Route>
    </main>

    <footer>
      <span>
        &copy; {new Date().getFullYear()} Jake Brown. Powered by
        <a href="https://svelte.dev" target="_blank" rel="noopener">Svelte</a>
        .
      </span>
    </footer>

  </Router>
</div>
