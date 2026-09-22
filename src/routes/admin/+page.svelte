<script lang="ts">
    import { Check, Trash } from '@lucide/svelte';
    import { Stack, Flex, Frame, Button, Switch } from 'azucar-ui';

    let file= $state<FileList | undefined>(undefined);
</script>

<Stack gap="xxl" style="padding: var(--size-md); max-width: min(100%, 800px); margin: 0 auto;">
    <h2>Admin board</h2>

    <Stack>
        <h3>Gestion de la base de donnée</h3>
        <Frame border={true}>
            <Stack gap="lg">
                <h4>Importer un JSON</h4>
                <p>
                    Importer des UEs sous forme de Json. Le Json doit être une
                    liste contenant au moins un attribut <strong>slug:
                    string</strong> et <strong>paths: string</strong>.
                </p>
                <form method="POST" action="?/addSubjects" enctype="multipart/form-data">
                    <Stack>
                        <input
                            type="file"
                            id="subjects"
                            name="subjects"
                            accept=".json"
                            bind:files={file}
                        />

                        <Switch id="merge" name="merge">Fusionner en cas de conflit</Switch>

                        <Flex gap="xs" style="flex-grow: 1" justify='right'>
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
            </Stack>
        </Frame>
        <Frame border={true}>
            <Stack gap="lg">
                <h4>Modifier des paths</h4>
            </Stack>
        </Frame>
    </Stack>

</Stack>
