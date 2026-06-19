<script lang="ts">

    import {
        Flex,
        Stack
    } from 'azucar-ui';

    import FileStructure from '$lib/components/FileStructure.svelte'
    import { fly } from 'svelte/transition'
    import type { PageData } from './$types';
    import type { FileData } from '$lib/types/types.d';

    const funWords = [
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
        "monétaire 🤑",
        "à Mohamed Ali 🥊",
        "critique 💥",
        "en 4K 📺",
        "cheatée 🎮",
        "pimentée 🌶️",
        "pur beurre 🥐",
        "du chef 👨‍🍳",
        "en pièce jointe 📎",
        "urgentissime 🚨",
        "existentielle 🧠",
        "préhistorique 🦴",
        "historique 📔",
        "de la babouche 🩴💥",
        "open-source 🔓",
        "chirurgicale 🩺",
        "balistique 🚀",
        "assourdissante 🔊",
    ];

    let funWord = $state("");

    function handleClick() {
		funWord = funWords[Math.floor(Math.random() * funWords.length)];
	}

    let { data }: { data: PageData } = $props();

    let files: FileData[] = $derived(data.files);
    const currentPath: string[] = $derived(data.currentPath.split("/"));

</script>

<Flex direction="column" gap="xl" margin="lg">
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
        <p>Sauve tes partiels.</p>
    </Stack>

    <Stack style="max-width: 100%; min-width: 0;">
        <FileStructure
            fileItems={files}
            current={currentPath}
        />
    </Stack>
</Flex>

<style>

    :global(.danger-text) {
        color: var(--color-error);
    }

    #italic {
        font-style: italic;
    }

    @media (max-width: 600px) {
        h1 {
            font-size: 2.5rem;
        }
    }

</style>
