<script lang="ts">
    import { TextInput } from "azucar-ui";

    type Props = {
        value?: string;
    };

    let { value = $bindable("") }: Props = $props();
</script>

<!--
    @component
    Composant surcharge de Azucar car problème de bind.
-->

<!-- On attent que azucar implémente TextInput avec flex-grow à 1 -->
<TextInput
    placeholder="Recherche"
    style="flex-grow: 2;"
    oninput={(e) => (value = (e.target as HTMLInputElement).value)}
/>
