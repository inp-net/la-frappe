<script lang="ts">

    import type { HTMLAttributes } from 'svelte/elements';

    import {
        Flex,
        Frame,
        Box
    } from "azucar-ui"

    import {
        Folder,
    } from '@lucide/svelte';

    type Props = HTMLAttributes<HTMLElement> & {
        name?: string;
        isFile?: boolean;
    };


    let {
        name = "salut",
        isFile = false
    } : Props = $props()

</script>

<Frame transparent={true} border={true} shadow={true}>
    <Flex align="center">
        <Box padding="xs">
            <Folder/>
        </Box>
        <h3>{name}</h3>
    </Flex>
</Frame>