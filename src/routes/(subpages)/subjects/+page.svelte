<script lang="ts">
    import type { PageData } from './$types.js';
    import { Flex } from 'azucar-ui';
    import { type FileData, StoragePaths } from '#lib/types/types.js';
    import FileList from '#lib/components/FileList.svelte';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>
        La Frappe · Listes des UEs
    </title>
</svelte:head>

<Flex direction="column" gap="xl" padding="lg" style="margin-bottom: 10rem; padding-top: 0;">
    <div class="browse-wrapper">
        <Flex direction="column" gap="lg" justify="center" align="center" style="width: 100%;">
            <FileList
                files={data.subjects ?? []}
                getUrl={(file) => {
                    return ""
                    // const filePath = file.path?.[0] ?? '';
                    // return file.isDirectory ? `/sub/${filePath}` : `/api/files/${filePath}`;
                }}
                metadatas={[
                    (f: FileData) => f.path?.[0]?.[0] ?? ''
                ]}
            />
        </Flex>
    </div>
</Flex>

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
