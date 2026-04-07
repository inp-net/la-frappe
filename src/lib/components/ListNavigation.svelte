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
        ChevronLeft,
        Plus
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
    <Frame>
        <Flex gap="md">
            <ChevronLeft/>
            <div id="bar"></div>
            <ChevronRight/>
        </Flex>
    </Frame>
    <div id="full">
        <Frame>
            <Flex gap="xs" align="center">
                {#each folderNames as folder : string, index}
                    <Button variant="ghost">
                        <h4>{folder}</h4>
                    </Button>
                    {#if index < (folderNames.length-1)}
                        <!-- Sorry -->
                        <Box padding="xxs"></Box>
                        <ChevronRight/>
                        <Box padding="xxs"></Box>
                    {/if}
                {/each}
            </Flex>
        </Frame>
    </div>
    <Frame>
        <Flex>
            <Plus/>
        </Flex>
    </Frame>
</Flex>

<style>

    #bar {
        width: 1px;
        background-color: var(--color-fg-solid);
    }

    #full {
        flex-grow: 3;
    }

    #folder-button {
        font-weight: bold;
    }
    
</style>