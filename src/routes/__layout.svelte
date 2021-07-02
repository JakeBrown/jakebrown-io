<script>
    import Header from '$lib/components/Header.svelte';
</script>

<div class="layout">
    <Header url="/" />
    <slot />
    <footer>
        <span>
            &copy; {new Date().getFullYear()} Jake Brown. Powered by
            <a href="https://svelte.dev" target="_blank" rel="noopener">Svelte.</a>
        </span>
    </footer>
</div>

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
        color: #aaa;
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
