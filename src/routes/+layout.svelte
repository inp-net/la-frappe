<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import "azucar-ui/tokens.css"
    import "azucar-ui/base.css"

    let l = $state(0.62);
    let c = $state(0.246);
    let h = $state(360);
    let isDarkTheme = $state(true);
    let cornerRadius = $state(39);
    
    $effect(() => {
            document.documentElement.style.setProperty('--base-color', `oklch(${l} ${c} ${h})`);
            document.documentElement.style.setProperty('color-scheme', isDarkTheme ? 'dark' : 'light');
            document.documentElement.style.setProperty('--corner-radius', `${cornerRadius}rem`);
        });

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
    {@render children()}
</div>

<style>
    /* center container */
    .container {
        max-width: min(1000px, 100%);
        margin: 0 auto;
    }
</style>
