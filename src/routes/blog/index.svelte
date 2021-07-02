<script context="module">
    export async function load({ error, status, fetch }) {
        let res = await fetch('/blog/posts.json');
        return {
            props: {
                body: await res.json()
            }
        };
    }
</script>

<script>
    import { fade, fly } from 'svelte/transition';
    export let body = [];
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<div in:fly={{ y: 200, duration: 500 }} class="container">
    <h1>Blog</h1>
    <p>Code snippets, patterns and code recipes.</p>
    {#each body as post, index}
        {#if index}
            <hr />
        {/if}
        <div class="post-item">
            <h2>
                <a href="/blog/posts/{post.slug}">{post.metadata.title}</a>
            </h2>
            <div class="post-item-footer">
                <span class="post-item-date">— {post.metadata.date}</span>
            </div>
        </div>
    {/each}
</div>

<style>
    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
</style>
