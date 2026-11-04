<script lang="ts">
    import type { PageData } from './$types.js';
    import { Flex } from 'azucar-ui';
    import type { FileData } from '#lib/types/types.ts';
    import FileList from '#lib/components/FileList.svelte';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>
        La Frappe · Listes des UEs
    </title>
</svelte:head>

<Flex direction="column" gap="xl" padding="lg" style="margin-bottom: 10rem;">
    <div class="browse-wrapper">
        <Flex direction="column" gap="lg" justify="center" align="center">
            <FileList
                files={data.subjects ?? []}
                metadatas={[
                    // généré par IA car c'est vraiment autiste prime
                    // permet de récupérer la filiaire SN / MF2E / 3EA avec un PATH
                    (f: FileData) => 
                        f.path && f.path.length > 0
                            ? [...new Set(f.path.map(p => p.split('/')[1]?.trim()).filter(Boolean))].join(' / ')
                            : 'aucun'
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
</style>
