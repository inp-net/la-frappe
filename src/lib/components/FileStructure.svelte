<script lang="ts">

    import ListNavigation from "./ListNavigation.svelte";

    import {
        Stack,
        Badge,
        Flex,
        Frame,
        Box,
        ButtonGroup,
        Button
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

    <!-- <ButtonGroup>
        <Button>td</Button>
        <Button variant="outline">tp</Button>
        <Button variant="outline">partielles</Button>
        <Button variant="outline">projets</Button>
    </ButtonGroup> -->

    <!-- <Flex gap="xs">
        <Badge>tout</Badge>
        <Badge variant="outline">td</Badge>
        <Badge variant="outline">tp</Badge>
        <Badge variant="outline">projets</Badge>
        <Badge variant="outline">partielles</Badge>
    </Flex> -->

    
    <Flex direction="column" padding="md">
        {#each folderNames as folder}
            <File name={folder}/>
        {/each}
    </Flex>

</Flex>
</Box>