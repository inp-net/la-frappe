<script lang="ts">
    import { Flex, Frame, Button } from "azucar-ui";
    import { Plus } from '@lucide/svelte';
    import ModalAddDocument from '$lib/components/ModalAddDocument.svelte';

    let isHovered = $state(false);
</script>

<!--
    @component
    Composant pour ajouter un fichier dans la DB.
-->

<Button
    variant="ghost"
    onmouseenter={() => isHovered = true} 
    onmouseleave={() => isHovered = false}
    command="show-popover"
    commandfor="add-file"
    style="padding: 0; margin: 0; text-decoration: none;"
>
    <Frame
        transparent={true}
        shadow={isHovered}
        style="flex-grow: 1; padding: var(--size-sm) var(--size-lg); border: dashed var(--color-border-subtle) 2px; background-color: transparent;"
    >
        <Flex align="center" wrap={false}>
            <Flex wrap={false}>
                <Plus size="1em"/>
            </Flex>
            <h4 class="file-name">Ajouter un document</h4>
        </Flex>
    </Frame>
</Button>

<ModalAddDocument id="add-file" />

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
