<script lang="ts">

    interface CurrentFile {
        current?: string[];
    };

    let { current = [] } : CurrentFile = $props();


    import {
        ChevronRight,
        ChevronLeft,
        Plus
    } from '@lucide/svelte';

    import {
        Button,
        Flex,
        Frame,
        Box
    } from 'azucar-ui';

</script>

<Flex gap="lg" align="center">
    <Frame>
        <Flex gap="md">
            <Button icon={ChevronLeft} variant="ghost" name="Move" />
            <div id="bar"></div>
            <Button icon={ChevronRight} variant="ghost" name="Move" />
        </Flex>
    </Frame>
    <div id="full">
        <Frame>
            <Flex gap="xs" align="center">
                <h4>/</h4>
                {#each current as folder : string, index}
                    <Button variant="ghost">
                        <h4>{folder}</h4>
                    </Button>
                    {#if index < (current.length-1)}
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
            <Button icon={Plus} variant="ghost" name="Move" />
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
