<script lang="ts">

    import {
        Button,
        Flex,
        Stack
    } from 'azucar-ui';

    import {
        Folders,
        Heart
    } from '@lucide/svelte';

    import FileStructure from '$lib/components/FileStructure.svelte'
    import { fly } from 'svelte/transition'
    import type { PageData } from './$types';

    let funWords = [
        "atomique 🤯",
        "à Pelé ⚽",
        "nucléaire ☢️",
        "en lucarne 🎯",
        "enroulé ↩️",
        "monumentale 🏛️",
        "de génie 🧞",
        "légendaire ✨",
        "magistrale 🎓",
        "caféinée ☕",
        "au clavier ⌨️",
        "éclair ⚡",
        "monétaire 🤑"
    ];

    let funWord = $state("");

    function handleClick() {
		funWord = funWords[Math.floor(Math.random() * funWords.length)];
	}

    // Api
    let { data }: { data: PageData } = $props();

    interface FileItem {
        name: string;
        isDirectory: boolean;
    }

    let items = $derived(data.items as FileItem[]);
    const currentPath = data.currentPath.split("/");

</script>

<Flex direction="column" gap="xxl" margin="lg">
    <Stack>
        <Flex>
        <h1
            onclick={handleClick}
            role="presentation"
        >La Frappe</h1>
        {#key funWord}
            <h1 in:fly={{ y: 20, duration: 400 }} id="italic">
                {funWord}
            </h1>
        {/key}
        </Flex>
        <p>Sauve tes partielles.</p>
    </Stack>

    <Stack>
        <FileStructure
            fileItems={data.items}
            current={currentPath}
        />
    </Stack>

<footer class="footer-container">
    <Flex align="center" justify="center" gap="md">
        <p>Made with Svelte</p>
        <Button icon={Heart} class="danger-text" name="Delete" />
        <p>Azucar-UI</p>
    </Flex>
</footer>

</Flex>

<style>

    .footer-container {
        position: fixed;
        bottom: 10px;
        left: 0;
        width: 100%;
        z-index: 10;
    }

    :global(.danger-text) {
        color: var(--color-error);
    }

    #italic {
        font-style: italic;
    }

</style>
