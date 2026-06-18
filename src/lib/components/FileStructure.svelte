<script lang="ts">

    import ListNavigation from "$lib/components/ListNavigation.svelte";
    import SearchBar from '$lib/components/SearchBar.svelte';
    import Filters from '$lib/components/Filters.svelte';

    import {
        Flex,
        Box
    } from "azucar-ui"

    import File from "./File.svelte";

    import type { FileItem } from '$lib/store/types';
    import { categoriesAccepted } from '$lib/tools/filtre';

    interface Props {
        fileItems?: FileItem[];
        isFolders?: boolean[];
        current?: string[]; 
    };

    let { fileItems = [], current = $bindable([]) }: Props = $props();

    let filteredFiles = $derived(
        fileItems.filter(file => file.name !== 'metadata.json')
    );

    let activeFilterIndexes = $state<number[]>([]);

</script>

<div class="root-layout-wrapper">
<Box>
<Flex direction="column" gap="md" padding="xs" style="max-width: 100%; width: 100%; min-width: 0;">

    <!-- cette div sert à scroll horizontalement les filtes indépendament de la page -->
    <div class="filter-block">
        <Flex gap="md" direction="column" style="maxWidth: '100%', minWidth: 0">
            <ListNavigation />
            <div class="filters-wrapper">
                <Filters 
                    filters={categoriesAccepted} 
                    activeIndexes={activeFilterIndexes} 
                />
            </div>
        </Flex>
    </div>


    <!-- <hr/> -->
    
    <Flex direction="column" gap="xxs">
        {#key current.join('/')}
            {#each filteredFiles as file}
                <File
                    fileItem={file}
                />
            {/each}
        {/key}
    </Flex>

</Flex>
</Box>
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

    hr {
        border-color: var(--color-bg);
        background-color: var(--color-bg);
        color: var(--color-bg);
        height: 2px;
        border: 0;
    }

</style>
