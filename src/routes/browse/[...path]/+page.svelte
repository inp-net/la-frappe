<script lang="ts">
    import { Flex, Stack } from 'azucar-ui';
    import type { PageData } from './$types';
    import type { FileData } from '$lib/types/types.d';
    import FileStructure from '$lib/components/FileStructure.svelte'
    import Logo from '$lib/components/Logo.svelte';

    let { data }: { data: PageData } = $props();

    let files: FileData[] = $derived(data.files);
    const currentPath: string[] = $derived(data.currentPath.split("/"));
</script>

<svelte:head>
    <title>
        La Frappe · Naviguer les documents
    </title>
</svelte:head>

<Flex direction="column" gap="xl" margin="lg">
    <Stack style="max-width: 100%; min-width: 0;">
        <FileStructure
            fileItems={files}
            current={currentPath}
        />
    </Stack>
</Flex>

<style>
    :global(.danger-text) {
        color: var(--color-error);
    }
</style>
