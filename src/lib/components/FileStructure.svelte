<script lang="ts">

    import ListNavigation from "./ListNavigation.svelte";

    import {
        Flex,
        Box
    } from "azucar-ui"

    import File from "./File.svelte";

    import type { FileItem } from '$lib/store/types';

    interface Props {
        fileItems?: FileItem[];
        isFolders?: boolean[];
        current?: string[]; 
    };

    let { fileItems, current = $bindable([]) }: Props = $props();

</script>

<Box>
<Flex direction="column" gap="md" padding="xs">

    <ListNavigation/>
    
    <Flex direction="column" padding="md">
    {#key current.join('/')}
        {#each fileItems as file}
            <File
                fileItem={file}
            />
        {/each}
        {/key}
    </Flex>

</Flex>
</Box>
