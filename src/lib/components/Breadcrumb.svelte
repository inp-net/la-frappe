<script lang="ts">

    import { ChevronRight, ChevronLeft, Plus } from '@lucide/svelte';
    import { Button, Flex, Box } from 'azucar-ui';

    interface Props {
        file_list: string[];
        onFolderClick?: (index: number) => void;
    }

    let { file_list, onFolderClick }: Props = $props();

</script>

<div class="breadcrum">
    <Flex align="center" gap="xxs">
        <Button variant="ghost" onclick={() => onFolderClick?.(-1)}>
            <h4>/</h4>
        </Button>

        {#each file_list as folder, index}
            <Box padding="xxs">
                <ChevronRight size={16} style="display: flex; align-items: center;" />
            </Box>
            
            <Button variant="ghost" onclick={() => onFolderClick?.(index)}>
                <h4>{folder}</h4>
            </Button>
        {/each}
    </Flex>
</div>

<style>
    .ghost-spacer {
        visibility: hidden;
        width: 0;
        margin: 0;
    }

    .breadcrum {
        background-color: var(--color-fg-solid);
        border-radius: var(--corner-radius);
    }

    h4 {
        margin: 0;
        line-height: var(--size-lg);
        display: flex;
        align-items: center;
        text-transform: capitalize;
        color: var(--color-fg-high); 
    }
</style>

