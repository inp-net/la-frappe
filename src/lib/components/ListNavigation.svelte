<script lang="ts">

    interface ListString {
        folderNames: string[];
    }

    let {
        folderNames
    } : ListString = $props();

    import {
        Folder,
        ChevronRight,
        ChevronLeft 
    } from '@lucide/svelte';

    import {
        Button,
        Flex,
        Stack,
        Frame,
        Box
    } from 'azucar-ui';

</script>

<Flex gap="lg" align="center">
   <Flex gap="xs">
        <ChevronLeft/>
        <ChevronRight/>
    </Flex>
    <Frame>
        <Flex gap="xs" align="center">
            {#each folderNames as folder : string, index}
                <a id="folder-button">
                    <h4>{folder}</h4>
                </a>
                {#if index < (folderNames.length-1)}
                    <!-- Sorry -->
                    <Box padding="xxs"></Box>
                    <ChevronRight/>
                    <Box padding="xxs"></Box>
                {/if}
            {/each}
        </Flex>
    </Frame>
</Flex>

<style>

    #folder-button {
        font-weight: bold;
    }
    
</style>