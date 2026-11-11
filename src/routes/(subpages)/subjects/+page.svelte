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
                    return StoragePaths.DEFAULT_PAGE_LOCATION + (file.path?.[0] ?? '');
                }}
                metadatas={[
                    (f: FileData) => f.path?.[0].split('/')[0] ?? ''
                ]}
                filter={(file, search, opt) => {
                    const query = search.toLowerCase().trim();
                    if (!query) return true;

                    const name = file.name.toLowerCase();
                    const path = (file.path?.[0] || "").toLowerCase();
                    const author = (file.author || "").toLowerCase();
                    const type = (file.type || "").toLowerCase();

                    return name.includes(query) || path.includes(query) || author.includes(query) || type.includes(query);
                }}
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
