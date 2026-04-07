<script lang="ts">

    import ListNavigation from "./ListNavigation.svelte";

    import {
        Stack,
        Badge,
        Flex,
        Frame
    } from "azucar-ui"
    
    let folderNames = [ "ENSEEIHT", "SN" ]

</script>

<Frame>
<Flex direction="column" gap="md">

    <ListNavigation
        {folderNames}
    />

    <Flex>
        <Badge>Tout</Badge>
        <Badge variant="outline">Partielles</Badge>
        <Badge variant="outline">TD</Badge>
        <Badge variant="outline">TP</Badge>
        <Badge variant="outline">Projets</Badge>
    </Flex>

</Flex>
</Frame>