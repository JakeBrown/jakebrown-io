<script>
    import { showDemo } from '$lib/store.js';
    function showDemoFunc() {
        console.log('toggling demo ');
        $showDemo = !$showDemo;
    }
</script>

<svelte:head>
    <title>Jake Brown</title>
</svelte:head>
<div class="home-container">
    <div class="home-copy">
        <h1>Jake Brown</h1>
        <p>Developer. EyeSpace™ co-founder and CTO.</p>
    </div>

    <figure on:click={showDemoFunc}>
        <img alt="Robot" src="undraw-illustration-2.svg" />
    </figure>
</div>

<style>
    .home-container {
        align-items: center;
        display: flex;
        flex: 1;
        justify-content: center;
        margin: 2em 0;
        min-height: 400px;
    }

    .home-copy {
        flex: 1;
    }

    h1 {
        font-weight: 700;
        margin-bottom: 0.5em;
    }

    p {
        font-size: 1.4em;
        line-height: 1.5;
    }

    figure {
        margin: 0 1em;
        text-align: center;
    }

    figcaption {
        font-size: 0.8em;
        font-style: italic;
    }

    img {
        width: 100%;
        max-width: 400px;
    }

    @media (max-width: 1020px) {
        p {
            font-size: 1.2em;
        }

        img {
            max-width: 300px;
        }
    }

    @media (max-width: 800px) {
        .home-container {
            flex-direction: column;
        }

        .home-copy {
            flex: 0;
            padding-bottom: 2em;
            text-align: center;
        }
    }
</style>
