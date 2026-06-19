<script lang="ts">

    import type { HTMLAttributes } from 'svelte/elements';
    import { StoragePaths, type FileData } from '$lib/types/types.d';
    import { Flex, Frame, Button, Badge } from "azucar-ui";
    import { Folder, File } from '@lucide/svelte';

    let isHovered = $state(false);

    type Props = HTMLAttributes<HTMLElement> & {
        fileItem: FileData;
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
        `/${StoragePaths.DEFAULT_DB_LOCATION}${realPath}`.replace(/\/+/g, '/')
    );

    /** Position de la page (svelte) pour naviger dans la DB. */
    let href = $derived(
        `/${StoragePaths.DEFAULT_PAGE_LOCATION}${realPath}`.replace(/\/+/g, '/')
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
        <Flex>
            {#if fileItem.isDirectory}
                <Folder/>
            {:else}
                <File/>
                <div id="badge">
                    <Badge>Partiel</Badge>
                </div>
            {/if}
        </Flex>
        <h3>{fileItem.name}</h3>
        {#if fileItem.isDirectory}
            <h4 style="margin-left: auto;" id="file-count">12 fichiers</h4>
        {/if}
    </Flex>
</Frame>
</Button>

<style>

    h3 {
        text-decoration: none;
        text-transform: capitalize;
    }

    #file-count {
        margin-left: auto;
        white-space: nowrap;
    }

    @media (max-width: 500px) {
        #file-count {
            display: none;
        }
    }

    @media (max-width: 400px) {
        #badge {
            display: none;
        }
    }

</style>
