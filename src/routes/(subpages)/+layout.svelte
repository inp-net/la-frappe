<script lang="ts">
    import {
        ArrowLeft,
    } from '@lucide/svelte';

    import {
        Button,
        Flex,
        Stack
    } from 'azucar-ui'

    let { children }: LayoutProps = $props();
</script>

<div class="browse-wrapper">
    <Button href="/" icon={ArrowLeft} variant="outline" style="text-decoration: none;"><p>Retour</p></Button>
</div>

{@render children()}

<style>
    .browse-wrapper {
        width: 100%;
        max-width: min(100%, 900px);
        margin: 0 auto;
    }
</style>
