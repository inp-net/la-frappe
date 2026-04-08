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
    const names = $derived<string[]>(items.map(item => item.name));
    const currentPath = data.currentPath.split("/");
    console.log(names);

</script>

<Flex direction="column" gap="xxl" margin="lg">
    <Stack>
        <Flex>
        <h1
            onclick={handleClick}
            role="presentation"
        >La Frappe</h1>
        {#key funWord}
            <h1 in:fly={{ y: 20, duration: 400 }}>
                {funWord}
            </h1>
        {/key}
        </Flex>
        <p>Sauve tes partielles.</p>
    </Stack>

    <Stack>
        <FileStructure
            folderNames={names}
            current={currentPath}
        />
    </Stack>

<div class="footer-container center">
    <Flex align="center">
        <p>Made with Svelte</p>
        <Button icon={Heart} class="danger" name="Delete"/>
        <p>Azucar-UI</p>
    </Flex>
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