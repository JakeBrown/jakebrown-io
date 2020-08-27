<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
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
  import { Link } from 'svelte-routing'
  import { fade, fly} from 'svelte/transition';
  export let posts
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<div in:fly="{{ y: 200, duration: 500 }}" class="container">
  <h1>Blog</h1>
  <p>Code snippets, patterns and recipes. This is mostly just my personal notepad.</p>
  {#each posts as post, index}
    {#if index}
      <hr />
    {/if}
    <div class="post-item">
      <h2>
        <Link to="blog/{post.slug}">{post.title}</Link>
      </h2>
      <p>{post.excerpt}</p>
      <div class="post-item-footer">
        <span class="post-item-date">— {post.printDate}</span>
      </div>
    </div>
  {/each}
</div>
