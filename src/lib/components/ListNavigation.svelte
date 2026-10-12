<script lang="ts">

    import { MoveLeft } from '@lucide/svelte';
    import { Button, Flex, Frame } from 'azucar-ui';
    import Breadcrumb from '#lib/components/Breadcrumb.svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { StoragePaths } from '#lib/types/types.js';

    let cleanFolderList = $derived(page.params.path?.split('/').filter(Boolean) ?? []);

    let navigateBack = $derived.by(() => {
        const segments = (StoragePaths.DEFAULT_PAGE_LOCATION + (page.params.path ?? '')).split('/').filter(Boolean);
        if (segments.length <= 1) return `/${StoragePaths.DEFAULT_PAGE_LOCATION}`;
        return '/' + segments.slice(0, -1).join('/');
    });

    function handleNavigation(index: number) {
        if (index === -1) {
            goto(`/${StoragePaths.DEFAULT_PAGE_LOCATION}`);
            return;
        }
        const segments = (StoragePaths.DEFAULT_PAGE_LOCATION + (page.params.path ?? '')).split('/').filter(Boolean);
        const targetPath = segments.slice(0, index + 2).join('/');
        goto(`/${targetPath}`);
    }

</script>

<!--
    @component
    Barre du haut de FileStructure. Contient les composants de navigation,
    bouton retour, bouton ajouté le document, ...
-->

<Flex gap="md" align="stretch" wrap={false} style="max-width: 100%; min-width: 0; width: 100%;">
    <Frame style="display: flex; align-items: center; flex-grow: 1; width: 100%; min-width: 0;">
        <Flex gap="md" wrap={false} style="width: 100%; min-width: 0; align-items: center;">
            <div id="back-button">
                <Flex gap="md" align="center" style="flex-shrink: 0;">
                    <Button icon={MoveLeft} variant="ghost" href={navigateBack} />
                </Flex>
            </div>

            <div id="full">
                <Breadcrumb file_list={cleanFolderList} onFolderClick={handleNavigation} />
            </div>
        </Flex>
    </Frame>
</Flex>

<style>
    #full {
        display: flex;
        gap: var(--size-md);
        flex-grow: 1;
        min-width: 0;
    }

    @media (max-width: 600px) {
        #back-button {
            display: none;
        }
    }
</style>
