<script>
    import { fade, fly } from 'svelte/transition';
    const posts = import.meta.glob('./posts/*.svx');
    let body = [];

    async function loadPosts() {
        console.log(posts);
        for (const path in posts) {
            console.log(path);
            let post = await posts[path]();
            body.push({
                metadata: post.metadata,
                slug: path.replace('./posts/', '').replace('.svx', '')
            });
        }
        console.log(posts);
        console.log(body);
        body = body;
    }
    loadPosts();
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<div in:fly={{ y: 200, duration: 500 }} class="container">
    <h1>Blog</h1>
    <p>Code snippets, patterns and recipes. This is mostly just my personal notepad.</p>
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
