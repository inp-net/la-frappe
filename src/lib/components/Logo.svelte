<script lang="ts">

    import { Flex } from 'azucar-ui';
    import { fly } from 'svelte/transition'

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

<Flex gap="md" wrap={false} align="start">
    <svg class="logo-svg" viewBox="-2 -2 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59091 16L15.9298 19.7636L7.5 25H17.5" stroke="#FF00B8" stroke-width="3" stroke-linecap="square" stroke-linejoin="bevel"/>
        <path d="M24.5 6.5V25L23 26.5H18.5V23.5H21.5V8H10V11H7V6.5L8.5 5H23L24.5 6.5Z" fill="var(--color-fg-high)"/>
    </svg>

    <Flex direction="column" gap="xxs">
        <Flex gap="xs" align="baseline">
            <h1 onclick={handleClick} role="presentation">La Frappe</h1>
            {#key funWord}
                <h1 in:fly={{ y: 20, duration: 400 }} id="italic">
                    {funWord}
                </h1>
            {/key}
        </Flex>
        
        <p>Sauve tes partiels.</p>
    </Flex>
</Flex>

<style>
    #italic {
        font-style: italic;
    }

    .logo-svg {
        width: 4.7rem;
        height: 4.7rem;
        margin-top: 0.2rem; 
    }

    @media (max-width: 600px) {
        h1 {
            font-size: 2.5rem;
        }

        .logo-svg {
            width: 2.37rem;
            height: 2.37rem;
            margin-top: 1px;
        }
    }

</style>
