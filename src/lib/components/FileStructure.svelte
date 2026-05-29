<script lang="ts">

    import ListNavigation from "$lib/components/ListNavigation.svelte";
    import SearchBar from '$lib/components/SearchBar.svelte';


    import {
        Flex,
        Box
    } from "azucar-ui"

    import File from "./File.svelte";

    import type { FileItem } from '$lib/store/types';

    interface Props {
        fileItems?: FileItem[];
        isFolders?: boolean[];
        current?: string[]; 
    };

    let { fileItems = [], current = $bindable([]) }: Props = $props();

    let filteredFiles = $derived(
        fileItems.filter(file => file.name !== 'metadata.json')
    );

</script>

<Box>
<Flex direction="column" gap="md" padding="xs">

    <Flex gap="lg" direction="column">
        <ListNavigation />
        <Flex>
            <SearchBar />
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
