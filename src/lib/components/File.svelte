<script lang="ts">
    import { toast } from 'svelte-sonner';
    import type { HTMLAttributes } from 'svelte/elements';
    import { StoragePaths, type FileData } from '$lib/types/types.d';
    import { Flex, Frame, Button } from "azucar-ui";
    import { Folder, File, X, SkullIcon } from '@lucide/svelte';

    let isHovered = $state(false);

    type Props = HTMLAttributes<HTMLElement> & {
        fileItem: FileData;
        showCross?: boolean;
    };

    let { fileItem, showCross = false } : Props = $props();

    import { page } from '$app/state';

    /** Position relative du fichier dans la navigation. */
    let realPath = $derived(
        // Le replace permet de supprimer les doubles dash //
        `/${page.params.path || ''}/${fileItem.name}`.replace(/\/+/g, '/')
    );

    /** Position réel du fichier dans le serveur. */
    let filePath = $derived(
        `/api/files/${realPath}`.replace(/\/+/g, '/')
    );

    /** Position de la page (svelte) pour naviger dans la DB. */
    let href = $derived(
        `/${StoragePaths.DEFAULT_PAGE_LOCATION}/${realPath}`.replace(/\/+/g, '/')
    );

    function handleDeleteClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        toast('Voulez-vous vraiment supprimer ce document ?', {
            description: 'Cette action est irréversible',
            action: {
                label: 'Supprimer',
                onClick: () => {
                    formElement.requestSubmit();
                }
            },
            cancel: {
                label: 'Annuler',
                onClick: () => {
                }
            }
        });
    }

    let formElement: HTMLFormElement;
</script>

<!--
    @component
    Composant bouton fichier. Permet de naviguer dans l'arborescence.
-->

<Flex wrap={false} justify="end" align="center" gap="xs">
    <Button
        href={fileItem.isDirectory ? href : filePath}
        target={fileItem.isDirectory ? '' : '_blank'}
        variant="ghost"
        onmouseenter={() => isHovered = true} 
        onmouseleave={() => isHovered = false}
        style="padding: 0; margin: 0; text-decoration: none; flex-grow: 1;"
    >
        <Frame transparent={false} border={isHovered} shadow={isHovered} style="flex-grow: 1; padding: var(--size-sm) var(--size-lg);">
            <Flex wrap={false} align="center">
                <Flex wrap={false}>
                    {#if fileItem.isDirectory}
                        <Folder size="1em"/>
                    {:else}
                        <File size="1em"/>
                    {/if}
                    <abbr class="file-name" title={fileItem.type && fileItem.date && fileItem.author ? `${fileItem.type} - ${fileItem.date} - ${fileItem.author}` : ``}>{fileItem.name}</abbr>
                </Flex>
            </Flex>
        </Frame>
    </Button>
    {#if !fileItem.isDirectory && showCross}
        <form bind:this={formElement} method="POST" action="?/delete">
            <input type="hidden" name="path" value={realPath} />
            <Button 
                variant='outline'
                type="button"
                icon={X}
                onclick={handleDeleteClick}
            />
        </form>
    {/if}
</Flex>

<style>
    .file-name {
        text-decoration: none;
        text-transform: capitalize;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        flex-shrink: 1;
        font-size: 1em;
    }
</style>
