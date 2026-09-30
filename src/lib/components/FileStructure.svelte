<script lang="ts">
    import ListNavigation from "$lib/components/ListNavigation.svelte";
    import File from "./File.svelte";
    import ActionAddDocument from '$lib/components/ActionAddDocument.svelte';
    import { type FileData } from '$lib/types/types.d';
    import { Flex, Stack } from "azucar-ui";

    interface Props {
        fileItems?: FileData[];
        current?: string[]; 
        admin: boolean;
    };

    let { fileItems = [], current = $bindable([]), admin = false }: Props = $props();

    let filteredFiles: FileData[] = $derived(
        fileItems.filter(file => file.name !== 'metadata.json')
    );

    const containsFolder: boolean = $derived(
        !fileItems.every((f) => f.isDirectory)
    );
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
            <!-- <Flex> -->
            <!--     <SearchBar /> -->
            <!-- </Flex> -->
        </Stack>

        <!-- affiche l'arborescence courante dans FileStructure -->
        <Stack gap="md">
            {#key current.join('/')}
                {#if containsFolder}
                    <ActionAddDocument />
                {/if}
                <Stack gap="sm">
                    {#each filteredFiles as file}
                        <File
                            fileItem={file}
                            showCross={admin}
                        />
                    {/each}
                </Stack>
            {/key}
            <span style="height: 100px;"></span>
        </Stack>

    </Flex>
</div>

<style>
    .root-layout-wrapper {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
    }

    .filter-block {
        display: block;
        width: 100%;
        max-width: 100%;
    }
</style>
