<script lang="ts">
    import { Flex, Stack, TextInput  } from 'azucar-ui';
    import type { FileData } from '#lib/types/types.ts';
    import File from '#lib/components/File.svelte';
    import FileListNavigation from '#lib/components/FileListNavigation.svelte';

    interface Props {
        files: FileData[];
        metadatas?: ((f: FileData) => string)[];
    }

    let {
        files,
        metadatas = []
    }: Props = $props();

    let page: number = $state(0);
    let maxPage: number = $state(10);
    let searchValue: string = $state("");
</script>

<Stack gap="sm">
    <Flex align="center" justify="space-between">
        <TextInput />
        <FileListNavigation bind:page {maxPage} />
    </Flex>

    {#if files}
        {#each files as file}
            <File fileItem={file} showCross={false}>
                {#snippet metadata()}
                    {#each metadatas as meta}
                        <small class="text-muted">{meta(file)}</small>
                    {/each}
                {/snippet}
            </File>
        {/each}
    {/if}
</Stack>
