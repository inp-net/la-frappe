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

<Box>
<Flex direction="column" gap="md" padding="xs" style="max-width: 100%; width: 100%">

    <Flex gap="sm" direction="column">
        <ListNavigation />
        <Flex wrap={true} style="max-width: 100%; width: 100%;">
            <div class="filters-wrapper">
                <Filters 
                    filters={categoriesAccepted} 
                    bind:activeIndexes={activeFilterIndexes}
                />
            </div>
        </Flex>
    </Flex>


    <hr/>
    
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

<style>

    .filters-wrapper {
        flex: 1;
        min-width: 0;
    }

</style>
