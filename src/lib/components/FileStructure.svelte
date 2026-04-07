<script lang="ts">

    import ListNavigation from "./ListNavigation.svelte";

    import {
        Stack,
        Badge,
        Flex,
        Frame,
        Box
    } from "azucar-ui"

    import File from "./File.svelte";
    
    let folderNames = [ "ENSEEIHT", "SN", "1A" ]

</script>

<Box>
<Flex direction="column" gap="md" padding="md">

    <ListNavigation
        {folderNames}
    />

    <Flex gap="xs">
        <Badge>tout</Badge>
        <Badge variant="outline">td</Badge>
        <Badge variant="outline">tp</Badge>
        <Badge variant="outline">projets</Badge>
        <Badge variant="outline">partielles</Badge>
    </Flex>

    <Box padding="xs"></Box>
    
    <File name="TOB"/>
    <File name="Calcul Scientifique"/>
    <File name="Programmation impérative"/>
    <File name="Réseaux"/>

</Flex>
</Box>