<script lang="ts">
    import { Flex, Stack, TextInput, Select } from 'azucar-ui';
    import { Search } from '@lucide/svelte';
    import type { FileData } from '#lib/types/types.ts';
    import type { Snippet } from 'svelte';
    import File from '#lib/components/File.svelte';
    import FileListNavigation from '#lib/components/FileListNavigation.svelte';

    interface Props {
        files: FileData[];
        // une liste de lambdas qui permettent de récupérer des données
        // et les afficher à droite du fichier (ex nom, date, ...)
        metadatas?: ((f: FileData) => string)[];
        options?: string[];
        option?: string;
        getUrl: (file: FileData) => string;
        alt?: string;
        children?: Snippet;
    }

    let {
        files,
        metadatas = [],
        options = [],
        option = $bindable(),
        getUrl,
        alt = "",
        children
    }: Props = $props();

    // recherche
    let searchValue: string = $state("");

    let filteredFiles = $derived(
        files.filter(file => {
            const query = searchValue.toLowerCase().trim();
            if (!query) return true;
            
            const name = file.name.toLowerCase();
            const author = (file.author || "").toLowerCase();
            const type = (file.type || "").toLowerCase();

            return name.includes(query) || author.includes(query) || type.includes(query);
        })
    );

    $effect(() => {
        searchValue;
        page = 0;
    });

    // pagination
    let page: number = $state(0);
    let showPerPage: number = $state(18);
    let maxPage: number = $derived(Math.max(0, Math.ceil(filteredFiles.length / showPerPage) - 1));
    
    let pageFiles = $derived(
        filteredFiles.slice(page * showPerPage, (page + 1) * showPerPage)
    );
</script>

<!--
    composant abstrait pour afficher une liste de fichiers / dossiers.
-->

<Stack gap="lg">
    <Flex align="center" justify="space-between">
        <Flex align="center">
            <TextInput icon={Search} bind:value={searchValue} placeholder="Rechercher"/>
            {#if options.length > 0}
                <Select {options} value={option} />
            {/if}
        </Flex>
        <FileListNavigation bind:page {maxPage} />
    </Flex>

    <Stack gap="sm">
        {@render children?.()}
        {#each pageFiles as file}
            <File url={getUrl(file)} fileItem={file} showCross={false}>
                {#snippet metadata()}
                    {#each metadatas as meta}
                        <small class="text-muted">{meta(file)}</small>
                    {/each}
                {/snippet}
            </File>
        {/each}
    </Stack>
</Stack>
