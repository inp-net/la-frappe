<script lang="ts">
    interface CurrentFile {
        current?: string[];
    }

    // let { current = [] }: CurrentFile = $props();

    import { ChevronRight, ChevronLeft, Plus } from '@lucide/svelte';
    import { Button, Flex, Frame, Box } from 'azucar-ui';
    
    const SEPARATOR = '/';

    import { page } from '$app/state';

    let current = $derived(page.params.path?.split('/').filter(Boolean) ?? []);

</script>

<Flex gap="lg" align="stretch"> <Frame style="display: flex; align-items: center;">
        <Flex gap="md" align="center">
            <Button icon={ChevronLeft} variant="ghost" name="Back" />
            <div id="bar"></div>
            <Button icon={ChevronRight} variant="ghost" name="Forward" />
        </Flex>
    </Frame>

    <div id="full">
        <Frame style="height: 100%; display: flex; flex-grow: 3; align-items: center;">
            <Flex gap="xs" align="center">
                <Button variant="ghost">
                    <h4>{SEPARATOR}</h4>
                </Button>

                {#each current as folder, index}
                    <Box padding="xxs"><ChevronRight size={16} /></Box>
                    <Button variant="ghost">
                        <h4>{folder}</h4>
                    </Button>
                {/each}
                
                {#if current.length === 0}
                    <h4 class="ghost-spacer" aria-hidden="true">&#8203;</h4>
                {/if}
            </Flex>
        </Frame>
    </div>

    <Frame style="display: flex; align-items: center;">
        <Flex align="center">
            <Button icon={Plus} variant="ghost" name="Add" />
        </Flex>
    </Frame>
</Flex>

<style>
    h4 {
        margin: 0;
        line-height: var(--size-lg);
        display: flex;
        align-items: center;
    }

    .ghost-spacer {
        visibility: hidden;
        width: 0;
        margin: 0;
    }

    #bar {
        width: 1px;
        height: var(--size-md);
        background-color: var(--color-fg-solid);
        opacity: 0.2;
    }

    #full {
        flex-grow: 3;
        display: flex; 
    }
</style>
