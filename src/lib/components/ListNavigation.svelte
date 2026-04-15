<script lang="ts">

    import { FOLDER } from '$lib/constants/index';
    import { ChevronRight, ChevronLeft, Plus } from '@lucide/svelte';
    import { Button, Flex, Frame, Box } from 'azucar-ui';
    
    const SEPARATOR = '/';

    import { page } from '$app/state';

    let current = $derived(page.params.path?.split('/').filter(Boolean) ?? []);

    let navigateBack = $derived(() => {
        const segments = (FOLDER.DEFAULT_PAGE_LOCATION + page.params.path || '').split('/').filter(Boolean);
        
        if (segments.length <= 1) return FOLDER.DEFAULT_PAGE_LOCATION;
        
        return '/' + segments.slice(0, -1).join('/');
    });

    function getPathTo(index : number) {
        const segments = (FOLDER.DEFAULT_PAGE_LOCATION + page.params.path || '').split('/').filter(Boolean);
        // + 2 car on ajoute /browse/ en tant que source
        const path = segments.slice(0, index + 2).join('/');
        return `/${path}`;
    }

    function navigateRoot() {
        return `/${FOLDER.DEFAULT_PAGE_LOCATION}`;
    }

</script>

<Flex gap="lg" align="stretch"> <Frame style="display: flex; align-items: center;">
        <Flex gap="md" align="center">
            <Button icon={ChevronLeft} variant="ghost"
                href={navigateBack()}
            />
            <!-- <div id="bar"></div> -->
            <!-- <Button icon={ChevronRight} variant="ghost" name="Forward" /> -->
        </Flex>
    </Frame>

    <div id="full">
        <Frame style="height: 100%; display: flex; flex-grow: 3; align-items: center;">
            <Flex gap="xs" align="center">
                <Button variant="ghost"
                    href={navigateRoot()}    
                >
                    <h4>{SEPARATOR}</h4>
                </Button>

                {#each current as folder, index}
                    <!-- Pour l'espacement à droite à gauche -->
                    <Box padding="xxs">
                    <ChevronRight size={16} style="align-content: center; display: flex; justify-content: center;"/>
                    </Box>
                    <Button variant="ghost"
                        href={getPathTo(index)}
                    >
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
        text-transform: capitalize;
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
