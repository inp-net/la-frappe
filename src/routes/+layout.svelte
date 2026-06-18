<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import "azucar-ui/tokens.css"
    import "azucar-ui/base.css"
    import { onMount } from 'svelte';

    import {
        Sun,
        Moon,
        Heart
    } from '@lucide/svelte';

    import {
        Button,
        Flex
    } from 'azucar-ui'

    const dark_l = 0.62;
    const dark_c = 0.556;
    const dark_h = 360;

    const white_l = 0.62;
    const white_c = 0.546;
    const white_h = 360;

    let l = $state(white_l);
    let c = $state(white_c);
    let h = $state(white_h);
    let isDarkTheme = $state(false);
    let iconTheme = $state(Moon);

    function getThemeFromCookie(): boolean {
        if (typeof document === 'undefined') return false;
        const match = document.cookie.match(new RegExp('(^| )theme=([^;]+)'));
        return match ? match[2] === 'dark' : false;
    }

    function setThemeCookie(dark: boolean) {
        document.cookie = `theme=${dark ? 'dark' : 'light'}; max-age=31536000; path=/; SameSite=Lax`;
    }

    onMount(() => {
        isDarkTheme = getThemeFromCookie();
        iconTheme = isDarkTheme ? Sun : Moon;
    });

    $effect(() => {
        document.documentElement.style.setProperty('--base-color', `oklch(${l} ${c} ${h})`);
        document.documentElement.style.setProperty('color-scheme', isDarkTheme ? 'dark' : 'light');
    });

    function switchTheme() {
        isDarkTheme = !isDarkTheme;
        iconTheme = isDarkTheme ? Sun : Moon;
        setThemeCookie(isDarkTheme);
    } 
    
    $effect(() => {
        document.documentElement.style.setProperty('--base-color', `oklch(${l} ${c} ${h})`);
        document.documentElement.style.setProperty('color-scheme', isDarkTheme ? 'dark' : 'light');
    });

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
    <div class ="sticky">
        <Button icon={iconTheme} variant="outline" name="Move" style="position: absolute; right: 10px;" 
            onclick={switchTheme}
        />
    </div>
    {@render children()}
    <footer class="footer-container">
        <Flex align="center" justify="center" gap="md">
            <p>Made with Svelte</p>
            <Button icon={Heart} class="danger-text" name="Delete" />
            <p>Azucar-UI</p>
        </Flex>
    </footer>
</div>

<style>
    /* center container */
    .container {
        max-width: min(1000px, 100%);
        margin: 0 auto;
    }

    .sticky {
        position: sticky;
        top: 20px;
        display: flex;
        justify-content: right;
    }

    .footer-container {
        background-color: var(--color-bg-app);
        position: fixed;
        bottom: 0px;
        padding: 10px 0px;
        left: 0;
        width: 100%;
        z-index: 10;
    }

</style>
