<script context="module">
    export async function load({ fetch }) {
        console.log('Loading posts');
        const postsResponse = await fetch('/blog.json');
        const posts = await postsResponse.json();
        console.log(posts);
        return {
            props: { posts }
        };
    }
</script>

<script>
    import { fade, fly } from 'svelte/transition';
    export let posts;
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<div in:fly={{ y: 200, duration: 500 }} class="container">
    <h1>Blog</h1>
    <p>Code snippets, patterns and recipes. This is mostly just my personal notepad.</p>
    {#each posts as post, index}
        {#if index}
            <hr />
        {/if}
        <div class="post-item">
            <h2>
                <a href="blog/{post.slug}">{post.metadata.title}</a>
            </h2>
            <p>{post.excerpt}</p>
            <div class="post-item-footer">
                <span class="post-item-date">— {post.metadata.date}</span>
            </div>
        </div>
    {/each}
</div>

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
