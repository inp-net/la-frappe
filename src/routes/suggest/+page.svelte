<script lang="ts">
    import { Button, Flex, Stack, ButtonGroup, Frame, Switch, TextInput } from 'azucar-ui';
    import { Plus, SearchIcon, Check, Info } from '@lucide/svelte';
    import { Toaster, toast } from 'svelte-sonner';
    import Select from '$lib/components/Select.svelte';

    let newCategory = $state("");
    const categoryList = ["Département", "Filière", "Matière"];

</script>

<svelte:head>
    <title>La Frappe · Suggérer une catégorie</title>
</svelte:head>

<Flex direction="column" gap="xxl" margin="lg">

    <Stack>
        <Flex>
        <h2>Suggérer une catégorie</h2>
        </Flex>
        <p>Aidez-nous à enrichir nos catégories : suggérez une matière ou une filière manquante !</p>
    </Stack>

    <Stack>
        <Frame>
            <Flex direction="column">
                <h4>Modifier une catégorie</h4>
            </Flex>
        </Frame>
    </Stack>

    <Toaster richColors />
</Flex>
