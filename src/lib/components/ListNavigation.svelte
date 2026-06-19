<script lang="ts">

    import { ChevronLeft, Plus } from '@lucide/svelte';
    import { Button, Flex, Frame } from 'azucar-ui';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { StoragePaths } from '$lib/types/types.d';

    let cleanFolderList = $derived(page.params.path?.split('/').filter(Boolean) ?? []);
    let isHovered = $state(false);

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

<Flex gap="md" align="stretch" wrap={false} style="max-width: 100%; min-width: 0; width: 100%;">
    <Frame style="display: flex; align-items: center; flex-grow: 1; width: 100%; min-width: 0; overflow: hidden;">
        <Flex gap="lg" wrap={false} style="width: 100%; min-width: 0; align-items: center;">
                <div id="back-button">
            <Flex gap="md" align="center" style="flex-shrink: 0;">
                    <Button icon={ChevronLeft} variant="ghost" href={navigateBack} />
            </Flex>
                </div>

            <div id="full">
                <Breadcrumb file_list={cleanFolderList} onFolderClick={handleNavigation} />
            </div>
        </Flex>
    </Frame>

    <a href="/add" class="action-button-link">
        <Frame 
            style="display: flex; align-items: center; height: 100%; box-sizing: border-box;"
            border={isHovered} 
            shadow={isHovered}
            onmouseenter={() => isHovered = true}
            onmouseleave={() => isHovered = false}
        >
            <Flex align="center" wrap={false} style="height: 100%;">
                <h4 class="label">Nouveau document</h4>
                <div class="right">
                    <Plus />
                </div>
            </Flex>
        </Frame>
    </a>
</Flex>

<style>

    a {
        margin: 0;
        line-height: var(--size-lg);
        display: flex;
        align-items: center;
        text-transform: capitalize;
        color: var(--color-fg-high); 
        text-decoration: none;
        display: contents;
    }

    .action-button-link {
        flex-shrink: 0; 
        display: flex;
        align-items: stretch;
        height: auto;
    }

    .right {
        margin-left: auto; 
        display: flex;
        align-items: center;
    }

    #full {
        flex-grow: 1;
        min-width: 0;
        overflow: hidden;
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

