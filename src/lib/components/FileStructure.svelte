<script lang="ts">
    import ListNavigation from "#lib/components/ListNavigation.svelte";
    import ActionAddDocument from '#lib/components/ActionAddDocument.svelte';
    import FileList from '#lib/components/FileList.svelte';
    import { type FileData, DocumentType } from '#lib/types/types.js';
    import { Flex, Stack, Frame } from "azucar-ui";

    interface Props {
        fileItems?: FileData[];
        current?: string[]; 
        admin: boolean;
        locked: boolean; // si on ne peut pas upload de documents
    };

    let { fileItems = [], current = $bindable([]), admin = false, locked = false }: Props = $props();

    let filteredFiles: FileData[] = $derived(
        fileItems.filter(file => file.name !== 'metadata.json')
    );

    const containsFolder: boolean = $derived(
        !fileItems.every((f) => f.isDirectory)
    );

    let selectedOption = $state("Tous");
</script>

<!--
    @component
    Composant complet de navigation de fichier. Contient touts les
    sous-composants comme filtre, barre de recherche, ...
-->

<div class="root-layout-wrapper">
    <Flex direction="column" gap="md" style="max-width: 100%; width: 100%; min-width: 0;">

        <!-- cette div sert à scroll horizontalement les filtes indépendament de la page -->
        <Stack>
            <Flex gap="md" direction="column" style="maxWidth: '100%', minWidth: 0">
                <ListNavigation />
            </Flex>
        </Stack>

        <FileList
            files={filteredFiles}
            getUrl={(file) => {
                const filePath = file.path?.[0] ?? '';
                return file.isDirectory ? `/browse/${filePath}` : `/api/files/${filePath}`;
            }}
            metadatas = {[
                (file) => file?.author ?? '',
                (file) => file?.date?? '',
            ]}
            bind:option={selectedOption}
            options={["Tous", ...Object.values(DocumentType)]}
            filter={(file, search, opt) => {
                const query = search.toLowerCase().trim();
                const matchesSearch = !query || 
                    file.name.toLowerCase().includes(query) || 
                    (file.author || "").toLowerCase().includes(query) ||
                    (file.type || "").toLowerCase().includes(query);
                
                const matchesOption = file.isDirectory || !opt || opt === "Tous" || file.type === opt;
                return matchesSearch && matchesOption;
            }}
        >
            {#if !locked && containsFolder}
                <ActionAddDocument />
            {:else if locked}
                <Frame
                    transparent={true}
                    style="flex-grow: 1; padding: var(--size-sm) var(--size-lg); border: dashed var(--color-border-subtle) 2px; background-color: transparent;"
                >
                    <h4>L'ajout de documents est momentanément interrompu, essayer ultérieurement.</h4>
                </Frame>
            {/if}
        </FileList>

    </Flex>
</div>

<style>
    .root-layout-wrapper {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
    }
</style>
