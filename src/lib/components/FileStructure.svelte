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
    
    let folderNames = [ "ENSEEIHT", "SN", "1A" ]

</script>

<Box>
<Flex direction="column" gap="md" padding="xs">

    <ListNavigation
        {folderNames}
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
        <File name="TOB"/>
        <!-- <File name="Partiel 1" isFile={true}/> -->
        <File name="Calcul Scientifique"/>
        <File name="Programmation impérative"/>
        <File name="Réseaux"/>
    </Flex>

</Flex>
</Box>