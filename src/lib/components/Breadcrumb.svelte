<script lang="ts">
    import { tick } from 'svelte';
    import { ChevronRight } from '@lucide/svelte';
    import { Button, Flex, Box, Scroll } from 'azucar-ui';

    interface Props {
        file_list: string[];
        onFolderClick?: (index: number) => void;
    }

    let { file_list, onFolderClick }: Props = $props();

    // breadcrumb scroll effect
    let breadcrumbRoot: HTMLElement | null = $state(null);

    $effect(() => {
        file_list;
        tick().then(() => {
            requestAnimationFrame(() => {
                if (breadcrumbRoot) {
                    const scrollElement = breadcrumbRoot.querySelector('.scroll-content') as HTMLElement;
                    if (scrollElement) {
                        scrollElement.scrollTo({
                            left: scrollElement.scrollWidth,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    });

</script>

<!--
    @component
    Composant qui affiche l'arborescence de fichier.
    ENSEEIHT > 2A > ASR > ...
-->

<div class="breadcrum" bind:this={breadcrumbRoot}>
    <Flex align="center" gap="xxs">
        <Scroll gap="zero">
            <div class="fixed-root">
                <Button variant="ghost" onclick={() => onFolderClick?.(-1)}>
                    <h4 id="root">/</h4>
                </Button>
            </div>
            {#each file_list as folder, index}
                <Box padding="xxs" style="display: flex; align-items: center; flex-shrink: 0;">
                    <ChevronRight size={16} />
                </Box>
                
                <Button variant="ghost" onclick={() => onFolderClick?.(index)} style="flex-shrink: 0;">
                    <h4>{folder}</h4>
                </Button>
            {/each}
        </Scroll>
    </Flex>
</div>

<style>
    .breadcrum {
        background-color: var(--color-bg);
        border-radius: var(--corner-radius);
        width: 100%;
        max-width: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    h4 {
        margin: 0;
        line-height: var(--size-lg);
        display: flex;
        align-items: center;
        text-transform: capitalize;
        color: var(--color-fg-high); 
    }

    #root {
        position: inherit;
        bottom: 1px;
        left: 6px;
    }
</style>
