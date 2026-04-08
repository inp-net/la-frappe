<script lang="ts">

    import { FOLDER } from '$lib/constants/index';
    import type { HTMLAttributes } from 'svelte/elements';

    import {
        Flex,
        Frame,
        Box,
        Button
    } from "azucar-ui"

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

    let href = $derived(() => {
        if (fileItem.isDirectory) {
            const currentPath = FOLDER.DEFAULT_PAGE_LOCATION + page.params.path || '';
            return `/${currentPath}/${fileItem.name}`.replace(/\/+/g, '/'); 
        }
    });

</script>


<Button
    href={href()}
    variant="ghost"
    onmouseenter={() => isHovered = true} 
    onmouseleave={() => isHovered = false}
>
<Frame transparent={false} border={isHovered} shadow={isHovered} style="flex-grow: 1">
    <Flex align="center">
        <Box padding="xs">
            {#if fileItem.isDirectory}
                <Folder/>
            {:else}
                <File/>
            {/if}
        </Box>
        <h3>{fileItem.name}</h3>
    </Flex>
</Frame>
</Button>
