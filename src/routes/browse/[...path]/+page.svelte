<script lang="ts">
    import { Toaster } from 'svelte-sonner';
    import { Flex } from 'azucar-ui';
    import type { PageData } from './$types';
    import type { FileData } from '$lib/types/types.d';
    import FileStructure from '$lib/components/FileStructure.svelte'

    let { data }: { data: PageData } = $props();

    let files: FileData[] = $derived(data.files);
    const currentPath: string[] = $derived(data.currentPath.split("/"));
    const isAdmin: boolean = $derived(data.admin ?? false);
</script>

<svelte:head>
    <title>
        La Frappe · Naviguer les documents
    </title>
</svelte:head>

<Flex direction="column" gap="xl" padding="lg" style="margin-bottom: 10rem;">
    <div class="browse-wrapper">
        <FileStructure
            fileItems={files}
            current={currentPath}
            admin={isAdmin}
        />
    </div>
</Flex>

<Toaster />

<style>
    :global(.danger-text) {
        color: var(--color-error);
    }

    .browse-wrapper {
        width: 100%;
        max-width: min(100%, 800px);
        margin: 0 auto;
    }

    @media (max-width: 1524px) {
        .browse-wrapper {
            grid-template-columns: 1fr;
        }
    }
</style>
