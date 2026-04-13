<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import "azucar-ui/tokens.css"
    import "azucar-ui/base.css"

    import {
        Sun,
        Moon
    } from '@lucide/svelte';

    import {
        Button
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
    // let cornerRadius = $state(1.5);

    function switchTheme() {
        isDarkTheme = !isDarkTheme;
        l = isDarkTheme ? dark_l : white_l;
        c = isDarkTheme ? dark_c : white_c;
        h = isDarkTheme ? dark_h : white_h;
        iconTheme = isDarkTheme ? Sun : Moon;
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
        <Button icon={iconTheme} variant="outline" name="Move" 
            onclick={switchTheme}
        />
    </div>
    {@render children()}
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

</style>
