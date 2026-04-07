<script lang="ts">

    import {
        Button,
        Flex,
        Stack
    } from 'azucar-ui';

    import {
        House
    } from '@lucide/svelte';


    import FileStructure from '$lib/components/FileStructure.svelte'

</script>

<Flex direction="column" gap="xxl" margin="lg">

    <Stack>
        <h1>La Frappe</h1>
        <p>Sauve tes partielles.</p>
    </Stack>

    <Stack>
        <FileStructure/>
    </Stack>

<div class="footer-container center">
    <p>Made with Svelte ♡ Azucar UI</p>
</div>

</Flex>

<style>

    .footer-container {
        padding-bottom: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
    }

</style>
