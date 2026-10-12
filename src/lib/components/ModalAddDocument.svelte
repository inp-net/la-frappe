<script lang="ts">
    import { DocumentType } from '#lib/types/types.js';
    import { Check, Info } from '@lucide/svelte';
    import { Stack, Flex, Button, Select, Dialog, TextInput, Switch } from 'azucar-ui';

    const documentTypes: string[] = $derived([...Object.values(DocumentType)]);

    interface Props {
        id?: string;
        path?: string;
    }

    let {
        id = "add-file",
        path = ""
    }: Props = $props();

    let thisYear: number = $state(new Date().getFullYear());
    const univYear = $derived(`${thisYear} - ${thisYear + 1}`);
</script>

<!--
    @component
    Dialog pour ajouter un fichier.
-->

<Dialog {id} style="padding: var(--size-sm);">

    {path}

    <Flex direction='column' padding="md" gap="lg" style="width: min(100%, 1000px); max-width: min(100%, 1000px);">
        <h3>Ajouter un fichier ici</h3>
        <form method="POST" action="?/addDocument" enctype="multipart/form-data">

            <!-- formulaire -->
            
            <Stack>
                <Flex gap="md" align="center">
                    <span>Ajouter un fichier :</span>
                    <Flex gap="xs" align="center">
                        <input
                            type="file"
                            id="document"
                            name="document"
                            accept=".pdf"
                            required
                        />
                    </Flex>
                </Flex>

                <Select
                    name="type"
                    id="type"
                    options={documentTypes}
                    required
                >Type de document</Select>

                <Flex direction="column" gap="xxs">
                    <TextInput
                        name="date"
                        id="date"
                        type="number"
                        bind:value={thisYear}
                        min="1900"
                        max="2100"
                        step="1"
                        required
                    >Année universitaire : {univYear}</TextInput>
                </Flex>

                <Flex direction="column" gap="xxs">
                    <span>Contient corrigé ?</span>
                    <Switch id="correction" name="correction" />
                </Flex>

                <!-- informations complémentaires -->

                <Flex gap="xs" direction="column" wrap={false}>
                    <Flex gap="xs" align="baseline" wrap={false}>
                        <Info size="10px"/>
                        <span>Le corrigé (si disponible) doit être fusionné avec le sujet.</span>
                    </Flex>
                </Flex>

                <!-- validation du modal -->

                <Flex gap="xs" style="flex-grow: 1" justify='right'>
                    <Button
                        variant='outline'
                        command="hide-popover"
                        commandfor={id}
                    >
                        Retour
                    </Button>
                    <Button 
                        type="submit"
                        icon={Check} 
                        class="success" 
                        name="Success" 
                    >
                        Ajouter
                    </Button>
                </Flex>
            </Stack>
        </form>
    </Flex>
</Dialog>

<style>
    :global(.text-input input[type="file"]::file-selector-button) {
        display: none;
    }
</style>
