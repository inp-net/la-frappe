<script lang="ts">

    import { FOLDER } from '$lib/constants/index';
    import type { HTMLAttributes } from 'svelte/elements';

    import {
        Flex,
        Frame,
        Box,
        Button,
        Badge
    } from "azucar-ui";

    import {
        Folder,
        File
    } from '@lucide/svelte';

    import type { FileItem } from '$lib/store/types';

    let isHovered = $state(false);

    type Props = HTMLAttributes<HTMLElement> & {
        fileItem: FileItem;
    };

    let {
        fileItem
    } : Props = $props();

    import { page } from '$app/state';

    /** Position relative du fichier dans la navigation. */
    let realPath = $derived(
        // Le replace permet de supprimer les doubles dash //
        `/${page.params.path || ''}/${fileItem.name}`.replace(/\/+/g, '/')
    );

    /** Position réel du fichier dans le serveur. */
    let filePath = $derived(
        `/${FOLDER.DEFAULT_DB_LOCATION}${realPath}`.replace(/\/+/g, '/')
    );

    /** Position de la page (svelte) pour naviger dans la DB. */
    let href = $derived(
        `/${FOLDER.DEFAULT_PAGE_LOCATION}${realPath}`.replace(/\/+/g, '/')
    );

</script>


<Button
    href={fileItem.isDirectory ? href : filePath}
    target={fileItem.isDirectory ? '' : '_blank'}
    variant="ghost"
    onmouseenter={() => isHovered = true} 
    onmouseleave={() => isHovered = false}
>
<Frame transparent={false} border={isHovered} shadow={isHovered} style="flex-grow: 1">
    <Flex align="center">
        <Box>
            {#if fileItem.isDirectory}
                <Folder/>
            {:else}
                <File/>
            {/if}
        </Box>
        <Badge>Partiel</Badge>
        <h3>{fileItem.name}</h3>
        {#if fileItem.isDirectory}
            <h4 style="margin-left: auto;">12 fichiers</h4>
        {/if}
    </Flex>
</Frame>
</Button>

<style>

    h3 {
        text-decoration: none;
        text-transform: capitalize;
    }

</style>
