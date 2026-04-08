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

<Flex gap="lg">
    <Frame style="align-content: center;">
        <Flex gap="md">
            <Button icon={ChevronLeft} variant="ghost" name="Move" />
            <div id="bar"></div>
            <Button icon={ChevronRight} variant="ghost" name="Move" />
        </Flex>
    </Frame>
    <div id="full">
        <Frame>
            <Flex gap="xs" align="center">
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
    <Frame style="align-content: center;">
        <Flex align="center">
            <Button icon={Plus} variant="ghost" name="Move" />
        </Flex>
    </Frame>
</Flex>

<style>

    h4 {
        min-height: var(--size-lg);
    }
    
    .height-fix {
        height: var(--size-lg);
    }

    #bar {
        width: 1px;
        background-color: var(--color-fg-solid);
    }

    #full {
        flex-grow: 3;
    }
    
</style>
