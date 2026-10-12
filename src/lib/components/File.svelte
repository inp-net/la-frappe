<script lang="ts">
    import { toast } from 'svelte-sonner';
    import type { HTMLAttributes } from 'svelte/elements';
    import { StoragePaths, type FileData } from '#lib/types/types.js';
    import { Flex, Frame, Button } from "azucar-ui";
    import { Folder, File, X } from '@lucide/svelte';

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
                    if (formElement)
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

    const formattedName = $derived((fileItem?.name || '').replace(/-/g, ' '));
    let formElement: HTMLFormElement | undefined = $state();
</script>

<!--
    @component
    Composant bouton fichier. Permet de naviguer dans l'arborescence.
-->

<Flex wrap={false} justify="end" align="center" gap="xs" style="width: 100%; max-width: 100%; min-width: 0;">
    <Button
        href={fileItem.isDirectory ? href : filePath}
        target={fileItem.isDirectory ? '' : '_blank'}
        variant="ghost"
        onmouseenter={() => isHovered = true} 
        onmouseleave={() => isHovered = false}
        style="padding: 0; margin: 0; text-decoration: none; flex: 1 1 0; min-width: 0; display: flex; width: 100%;"
    >
        <Frame 
            transparent={false} 
            border={isHovered} 
            shadow={isHovered} 
            style="flex: 1 1 0; min-width: 0; width: 100%; max-width: 100%; padding: var(--size-sm) var(--size-lg); box-sizing: border-box; display: flex;"
        >
            <Flex wrap={false} align="center" style="min-width: 0; width: 100%;">
                {#if fileItem.isDirectory}
                    <Folder size="1em" />
                {:else}
                    <File size="1em" />
                {/if}
                
                <div class="native-scroll-wrapper">
                    <Flex gap="lg" style="flex-grow: 1;" justify="space-between" wrap={false}>
                        <abbr class="file-name" title={fileItem.type && fileItem.date && fileItem.author ? `${fileItem.type} - ${fileItem.date} -${fileItem.author}` : ``}>
                            {formattedName}
                        </abbr>
                        <Flex align="center" wrap={false} gap="sm">
                            {#if fileItem.author && fileItem.date}
                                <small class="text-muted">{fileItem?.author}</small>
                                <small class="text-muted">{fileItem?.date}</small>
                            {:else}
                                <small class="text-muted">Churros V2</small>
                            {/if}
                        </Flex>
                    </Flex>
                </div>
                <Flex gap="lg">
                </Flex>
            </Flex>
        </Frame>
    </Button>
    
    {#if !fileItem.isDirectory && showCross}
        <form bind:this={formElement} method="POST" action="?/delete" style="flex-shrink: 0;">
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
    .native-scroll-wrapper {
        flex: 1 1 0;
        min-width: 0;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        scrollbar-width: none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;
        margin-left: var(--size-xs, 8px);
    }

    .text-muted {
        font-weight: 500;
        color: var(--color-fg-low);
        white-space: nowrap;
    }

    .native-scroll-wrapper::-webkit-scrollbar {
        display: none;
    }

    .file-name {
        display: inline-block;
        text-decoration: none;
        text-transform: capitalize;
        white-space: nowrap;
        font-size: 1em;
    }
</style>
