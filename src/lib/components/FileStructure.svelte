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

    let filteredFiles: FileData[] = $derived(
        fileItems.filter(file => file.name !== 'metadata.json')
    );

    const filters: string[] = Object.values(DocumentTypes);
    let activeFiltersIndexes = $state<number[]>([]);
    let activeFilters = $state<string[]>([]);

</script>

<!--
    @component
    Composant complet de navigation de fichier. Contient touts les
    sous-composants comme filtre, barre de recherche, ...
-->

<div class="root-layout-wrapper">
    <Flex direction="column" gap="md" style="max-width: 100%; width: 100%; min-width: 0;">

        <!-- cette div sert à scroll horizontalement les filtes indépendament de la page -->
        <div class="filter-block">
            <Flex gap="md" direction="column" style="maxWidth: '100%', minWidth: 0">
                <ListNavigation />
                <div class="filters-wrapper">
                    <Filters 
                        filters={filters}
                        bind:activeIndexes={activeFiltersIndexes}
                    />
                </div>
            </Flex>
        </div>

        <!-- affiche l'arborescence courante dans FileStructure -->
        <Flex direction="column" gap="sm" style="max-width: 100%; overflow: hidden;">
            {#key current.join('/')}
                {#each filteredFiles as file}
                    {#if
                        file.isDirectory ||
                        activeFiltersIndexes.length === 0 ||
                        activeFiltersIndexes.map(i => filters[i].toLowerCase()).includes(file.type?.toLowerCase())
                    }
                        <File
                            fileItem={file}
                        />
                    {/if}
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
