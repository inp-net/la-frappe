<script lang="ts">

    import ListNavigation from "./ListNavigation.svelte";

    import {
        Flex,
        Box
    } from "azucar-ui"

    import File from "./File.svelte";
    
    interface Props {
        folderNames?: string[];
        current?:string[];
    };

    let { folderNames, current } : Props = $props();

</script>

<Box>
<Flex direction="column" gap="md" padding="xs">

    <ListNavigation
        current={current}
    />
    
    <Flex direction="column" padding="md">
        {#each folderNames as folder}
            <File name={folder}/>
        {/each}
    </Flex>

</Flex>
</Box>
