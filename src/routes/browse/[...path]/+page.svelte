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

<div class="maxwidth">
    <Flex direction="column" gap="xl" margin="lg" style="margin-bottom: 10rem;">
        <div class="browse-wrapper">
            <div id="grid-main">
                <FileStructure
                    fileItems={files}
                    current={currentPath}
                    admin={isAdmin}
                />
            </div>
        </div>
    </Flex>
</div>

<Toaster />

<style>
    :global(.danger-text) {
        color: var(--color-error);
    }

    .browse-wrapper {
        width: 100%;
        max-width: min(100%, 2000px);
        margin: 0 auto;

        display: grid;
        grid-template-columns: 320px 1fr 320px;
        gap: 1.5rem;
    }

    #grid-main {
        grid-row: 1;
        grid-column: 2;
        display: flex;
        justify-content: center;
        width: 100%;
        min-width: 0;
    }

    #grid-right {
        grid-row: 1;
        grid-column: 3;
    }

    @media (max-width: 1524px) {
        .browse-wrapper {
            grid-template-columns: 1fr;
        }

        .maxwidth {
            max-width: min(1000px, 100%);
            margin: 0 auto;
        }

        #grid-right {
            grid-row: 1;
            grid-column: 1;
        }

        #grid-main {
            grid-row: 2;
            grid-column: 1;
        }
    }
</style>
