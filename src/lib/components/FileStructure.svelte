<script lang="ts">

    import ListNavigation from "$lib/components/ListNavigation.svelte";
    import SearchBar from '$lib/components/SearchBar.svelte';
    import Filters from '$lib/components/Filters.svelte';
    import File from "./File.svelte";
    import { type FileData, DocumentTypes } from '$lib/types/types.d';
    import { Flex } from "azucar-ui"

    interface Props {
        fileItems?: FileData[];
        current?: string[]; 
    };

    let { fileItems = [], current = $bindable([]) }: Props = $props();

    let filteredFiles = $derived(
        fileItems.filter(file => file.name !== 'metadata.json')
    );

    let activeFilterIndexes = $state<number[]>([]);

</script>

<!--
    @component
    Composant complet de navigation de fichier. Contient touts les
    sous-composants comme filtre, barre de recherche, ...
-->

<div class="root-layout-wrapper">
    <Flex direction="column" gap="md" padding="xs" style="max-width: 100%; width: 100%; min-width: 0;">

        <!-- cette div sert à scroll horizontalement les filtes indépendament de la page -->
        <div class="filter-block">
            <Flex gap="md" direction="column" style="maxWidth: '100%', minWidth: 0">
                <ListNavigation />
                <div class="filters-wrapper">
                    <Filters 
                        filters={Object.values(DocumentTypes)}
                        activeIndexes={activeFilterIndexes}
                    />
                </div>
            </Flex>
        </div>

        <!-- affiche l'arborescence courante dans FileStructure -->
        <Flex direction="column" gap="xxs">
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

    .filters-wrapper {
        flex: 1;
        min-width: 0;
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
    }

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
