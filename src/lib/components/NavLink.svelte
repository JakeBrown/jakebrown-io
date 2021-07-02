<script type="ts">
    import { page } from '$app/stores';
    export let label: string;
    export let href: string;
    $: active = $page.path === href;
</script>

<a {href} class={active ? 'selected' : ''}>{label}</a>

<style>
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
</style>
