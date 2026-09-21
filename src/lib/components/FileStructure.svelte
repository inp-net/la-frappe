<script lang="ts">

    import ListNavigation from "$lib/components/ListNavigation.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import File from "./File.svelte";
    import { type FileData } from '$lib/types/types.d';
    import { Flex, Stack } from "azucar-ui";

    interface Props {
        fileItems?: FileData[];
        current?: string[]; 
    };

    let { fileItems = [], current = $bindable([]) }: Props = $props();

    let filteredFiles: FileData[] = $derived(
        fileItems.filter(file => file.name !== 'metadata.json')
    );

</script>

<!--
    @component
    Composant complet de navigation de fichier. Contient touts les
    sous-composants comme filtre, barre de recherche, ...
-->

<div class="root-layout-wrapper">
    <Flex direction="column" gap="md" style="max-width: 100%; width: 100%; min-width: 0;">

        <!-- cette div sert à scroll horizontalement les filtes indépendament de la page -->
        <Stack>
            <Flex gap="md" direction="column" style="maxWidth: '100%', minWidth: 0">
                <ListNavigation />
            </Flex>
            <Flex>
                <SearchBar />
            </Flex>
        </Stack>

        <!-- affiche l'arborescence courante dans FileStructure -->
        <Flex direction="column" gap="sm" style="max-width: 100%; overflow: hidden;">
            {#key current.join('/')}
                {#each filteredFiles as file}
                    <File
                        fileItem={file}
                    />
                {/each}
            {/key}
            <span style="height: 100px;"></span>
        </Flex>

    </Flex>
</div>

<style>
    .root-layout-wrapper {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
    }

    .filter-block {
        display: block;
        width: 100%;
        max-width: 100%;
    }
</style>
