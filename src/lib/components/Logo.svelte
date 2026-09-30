<script lang="ts">

    import { Flex } from 'azucar-ui';
    import { fly } from 'svelte/transition'
    import LogoFrappe from '$lib/components/icons/LogoFrappe.svelte';

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
        "oui c'est de l'IA 🤖"
    ];

    function handleClick() {
		funWord = funWords[Math.floor(Math.random() * funWords.length)];
	}

    let funWord = $state("");

</script>

<Flex gap="md" wrap={false} align="start" padding="md" style="max-width: min(1000px, 100%); margin: 0 auto; width: 100%;">
    <span id='icon' style="margin-top: 0.9rem;">
        <LogoFrappe fill='var(--color-fg-high)' size='4.1rem' />
    </span>

    <Flex direction="column" gap="xxs">
        <Flex gap="xs" align="baseline">
            <h2 class="title" onclick={handleClick} role="presentation">La Frappe</h2>
            {#key funWord}
                <h2 in:fly={{ y: 20, duration: 400 }} id="italic">
                    {funWord}
                </h2>
            {/key}
        </Flex>
        
        <p>Sauve tes partiels.</p>
    </Flex>
</Flex>

<style>
    #italic {
        font-style: italic;
    }
</style>
