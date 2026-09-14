<script lang="ts">

    import { ChevronLeft, Plus } from '@lucide/svelte';
    import { Button, Flex, Frame } from 'azucar-ui';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { StoragePaths } from '$lib/types/types.d';
    import Dropdown from '$lib/components/Dropdown.svelte';

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

    const menuItems = ['Ajouter un fichier', 'Ajouter un dossier'];

    function handleAction(action: string) {
        console.log('Clicked:', action);
    }

</script>

<!--
    @component
    Barre du haut de FileStructure. Contient les composants de navigation,
    bouton retour, bouton ajouté le document, ...
-->

<Flex gap="md" align="stretch" wrap={false} style="max-width: 100%; min-width: 0; width: 100%;">
    <Frame style="display: flex; align-items: center; flex-grow: 1; width: 100%; min-width: 0;">
        <Flex gap="lg" wrap={false} style="width: 100%; min-width: 0; align-items: center;">
            <div id="back-button">
                <Flex gap="md" align="center" style="flex-shrink: 0;">
                        <Button icon={ChevronLeft} variant="ghost" href={navigateBack} />
                </Flex>
            </div>

            <div id="full">
                <Breadcrumb file_list={cleanFolderList} onFolderClick={handleNavigation} />
                <Dropdown id="add-doc" menu={menuItems} eventAction={handleAction} align="right">
                    <Button type="button" variant="ghost" icon={Plus} popovertarget='add-doc'>
                        <span class="label">Ajouter</span>
                    </Button>
                </Dropdown>
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
        /* overflow: hidden; */
    }

    @media (max-width: 600px) {
        .label {
            display: none;
        }

        #back-button {
            display: none;
        }
    }
</style>
