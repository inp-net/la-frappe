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
    
    let folderNames = [ "ENSEEIHT", "SN" ]

</script>

<Box>
<Flex direction="column" gap="md" padding="md">

    <ListNavigation
        {folderNames}
    />

    <Flex gap="xs">
        <Badge>Tout</Badge>
        <Badge variant="outline">Partielles</Badge>
        <Badge variant="outline">TD</Badge>
        <Badge variant="outline">TP</Badge>
        <Badge variant="outline">Projets</Badge>
    </Flex>

    <Box padding="xs"></Box>
    
    <File name="TOB"/>
    <File name="Calcul Scientifique"/>
    <File name="Programmation impérative"/>
    <File name="Réseaux"/>

</Flex>
</Box>