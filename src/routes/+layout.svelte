<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import "azucar-ui/tokens.css"
    import "azucar-ui/base.css"

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
