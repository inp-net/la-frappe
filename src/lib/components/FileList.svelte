<script lang="ts">
    import { Flex, Stack, TextInput, Select } from 'azucar-ui';
    import { Search } from '@lucide/svelte';
    import type { FileData } from '#lib/types/types.ts';
    import type { Snippet } from 'svelte';
    import File from '#lib/components/File.svelte';
    import FileListNavigation from '#lib/components/FileListNavigation.svelte';

    interface Props {
        files: FileData[];
        metadatas?: ((f: FileData) => string)[];
        options?: string[];
        option?: string;
        getUrl: (file: FileData) => string;
        alt?: string;
        children?: Snippet;
        // Custom filter function defined by the parent (total flexibility)
        filter?: (file: FileData, searchValue: string, option?: string) => boolean;
    }

    let {
        files,
        metadatas = [],
        options = [],
        option = $bindable("Tous"),
        getUrl,
        alt = "",
        children,
        filter
    }: Props = $props();

    let searchValue: string = $state("");

    // Filters
    let filteredFiles = $derived(
        files.filter(file => {
            if (filter) {
                return filter(file, searchValue, option);
            }
            const query = searchValue.toLowerCase().trim();
            if (!query) return true;
            return file.name.toLowerCase().includes(query) || (file.author || "").toLowerCase().includes(query);
        })
    );

    // Pagination
    $effect(() => {
        searchValue;
        option;
        page = 0;
    });

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
        <Flex align="center" gap="xxs">
            <TextInput icon={Search} bind:value={searchValue} placeholder="Rechercher"/>
            {#if options.length > 0}
                <Select {options} bind:value={option} />
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
