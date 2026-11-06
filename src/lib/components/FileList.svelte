<script lang="ts">
    import { Flex, Stack, TextInput, Select } from 'azucar-ui';
    import { Search } from '@lucide/svelte';
    import type { FileData } from '#lib/types/types.ts';
    import File from '#lib/components/File.svelte';
    import FileListNavigation from '#lib/components/FileListNavigation.svelte';

    interface Props {
        files: FileData[];
        // une liste de lambdas qui permettent de récupérer des données
        // et les afficher à droite du fichier (ex nom, date, ...)
        metadatas?: ((f: FileData) => string)[];
        options?: string[];
        option?: string;
        // l'url qui sera devant chaque fichier comme target
        targetUrl?: string;
        alt?: string;
    }

    let {
        files,
        metadatas = [],
        options = [],
        option = $bindable(),
        targetUrl = '',
        alt = ""
    }: Props = $props();

    // recherche
    let searchValue: string = $state("");

    // pagination
    let page: number = $state(0);
    let showPerPage: number = $state(18);
    let maxPage: number = $derived(Math.max(0, Math.ceil(files.length / showPerPage) - 1));
    
    let pageFiles = $derived(
        files.slice(page * showPerPage, (page + 1) * showPerPage)
    );
</script>

<Stack gap="lg">
    <Flex align="center" justify="space-between">
        <Flex align="center">
            <TextInput icon={Search} bind:value={searchValue} placeholder="Rechercher par filiaire, nom, ..." />
            {#if options.length > 0}
                <Select {options} value={option} />
            {/if}
        </Flex>
        <FileListNavigation bind:page {maxPage} />
    </Flex>

    <Stack gap="sm">
        {#each pageFiles as file}
            <File url={targetUrl + (file.path ? file.path[0] : '')} fileItem={file} showCross={false}>
                {#snippet metadata()}
                    {#each metadatas as meta}
                        <small class="text-muted">{meta(file)}</small>
                    {/each}
                {/snippet}
            </File>
        {/each}
    </Stack>
</Stack>
