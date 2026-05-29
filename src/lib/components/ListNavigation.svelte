<script lang="ts">

    import { FOLDER } from '$lib/constants/index';
    import { ChevronLeft, Plus } from '@lucide/svelte';
    import { Button, Flex, Frame } from 'azucar-ui';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    let cleanFolderList = $derived(page.params.path?.split('/').filter(Boolean) ?? []);
    let isHovered = $state(false);

    let navigateBack = $derived.by(() => {
        const segments = (FOLDER.DEFAULT_PAGE_LOCATION + (page.params.path ?? '')).split('/').filter(Boolean);
        if (segments.length <= 1) return `/${FOLDER.DEFAULT_PAGE_LOCATION}`;
        return '/' + segments.slice(0, -1).join('/');
    });

    function handleNavigation(index: number) {
        if (index === -1) {
            goto(`/${FOLDER.DEFAULT_PAGE_LOCATION}`);
            return;
        }
        const segments = (FOLDER.DEFAULT_PAGE_LOCATION + (page.params.path ?? '')).split('/').filter(Boolean);
        const targetPath = segments.slice(0, index + 2).join('/');
        goto(`/${targetPath}`);
    }

</script>

<Flex gap="lg" align="stretch">
    <Frame style="display: flex; align-items: center; flex-grow: 3;">
        <Flex gap="lg">
            <Flex gap="md" align="center">
                <Button icon={ChevronLeft} variant="ghost" href={navigateBack} />
            </Flex>

            <div id="full">
                <Breadcrumb file_list={cleanFolderList} onFolderClick={handleNavigation} />
            </div>
        </Flex>
    </Frame>

    <a href="/add">
        <Frame 
            style="display: flex; align-items: center; flex-wrap: nowrap;"
            border={isHovered} 
            shadow={isHovered}
            onmouseenter={() => isHovered = true}
            onmouseleave={() => isHovered = false}
        >
                <Flex align="center">
                    <h4 class="label">Nouveau fichier</h4>
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

    .right {
        margin-left: auto; 
        display: flex;
        align-items: center;
    }

    @media (max-width: 700px) {
        .label {
            display: none;
        }
    }


</style>

