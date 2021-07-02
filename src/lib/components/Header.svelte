<script>
    import Logo from './Logo.svelte';
    import NavLink from './NavLink.svelte';
    export let url;
</script>

<header>
    <nav>
        <NavLink label="Home" href="/" />
        <NavLink label="About" href="/about" />
        <NavLink label="Blog" href="/blog" />
        <NavLink label="Contact" href="/contact" />
    </nav>
</header>

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

    .hidden {
        visibility: hidden;
    }
</style>
