<svelte:head>
    <title>Hidden Demo</title>
</svelte:head>

<div class="container">
    <h1>Hidden Demo Page</h1>
    <p>
        Outside of this, I enjoy hiking in the great outdoors, freediving, rock climbing, and
        powerlifting.
    </p>
</div>

<style>
    figure {
        float: right;
        margin: -3em -7em 2em 2em;
        max-width: 400px;
    }

    figure img {
        border-radius: 8px;
    }

    @media (max-width: 1020px) {
        figure {
            float: none;
            margin: 0 auto 2em;
        }
    }
</style>
