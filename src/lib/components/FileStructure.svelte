<script lang="ts">

    import ListNavigation from "./ListNavigation.svelte";

    import {
        Stack
    } from "azucar-ui"
    
    let folderNames = [ "names", "test" ]

</script>

<Stack>
    <ListNavigation
        {folderNames}
    />
</Stack>
