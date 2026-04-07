<script lang="ts">

    import {
        Button,
        Flex,
        Stack
    } from 'azucar-ui';

    import FileStructure from '$lib/components/FileStructure.svelte'
    import { fly } from 'svelte/transition'

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
        <FileStructure/>
    </Stack>

<div class="footer-container center">
    <p>Made with Svelte ♡ Azucar UI</p>
    <p>@Net7</p>
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
