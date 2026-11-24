<script lang="ts">
    import type { LayoutProps } from './$types.js';

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

<div class="padding">
    <div class="browse-wrapper">
        <Flex align="baseline" justify="space-between">
            <Button href="/" icon={ArrowLeft} variant="outline" style="text-decoration: none;"><p>Retour</p></Button>
            <Flex direction="column" align="right" gap="xxs">
                <h3>La Frappe</h3>
                <p>sauve tes partiels</p>
            </Flex>
        </Flex>
    </div>
</div>

<br style="height: var(--size-md)" />

{@render children()}

<style>
    .browse-wrapper {
        width: 100%;
        max-width: min(100%, 800px);
        margin: 0 auto;
    }

    .padding {
        padding: 0 var(--size-lg);
        margin-top: var(--size-lg);
    }
</style>
