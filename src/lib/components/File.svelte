<script lang="ts">

    import type { HTMLAttributes } from 'svelte/elements';

    import {
        Flex,
        Frame,
        Box
    } from "azucar-ui"

    import {
        Folder,
        File
    } from '@lucide/svelte';

    type Props = HTMLAttributes<HTMLElement> & {
        name?: string;
        isFile?: boolean;
    };

    let {
        name = "salut",
        isFile = false
    } : Props = $props()

    let isHovered = $state(false);

</script>

<div 
    onmouseenter={() => isHovered = true} 
    onmouseleave={() => isHovered = false}
    role="none"
>
<Frame transparent={false} border={isHovered} shadow={isHovered}>
    <Flex align="center">
        <Box padding="xs">
            {#if isFile}
                <File/>
            {:else}
                <Folder/>
            {/if}
        </Box>
        <h3>{name}</h3>
    </Flex>
</Frame>
</div>