<script lang="ts">
    import { Check, Trash } from '@lucide/svelte';
    import { Stack, Flex, Frame, Button } from 'azucar-ui';

    let file= $state<FileList | undefined>(undefined);
</script>

<Stack gap="xxl" style="padding: var(--size-md); max-width: min(100%, 800px); margin: 0 auto;">
    <h2>Admin board</h2>

    <Frame border={true}>
        <Stack gap="lg">
            <p>
                Importer des UEs sous forme de Json. Le Json doit être une
                liste contenant au moins un attribut <strong>name:
                string</strong> et <strong>paths: string</strong>
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
        <form method="POST" action="?/cleanup">
            <Flex justify="space-between" align="center">
                <p>Supprimer les UEs vides</p>
                <Button 
                    type="submit"
                    icon={Trash} 
                    class="danger" 
                    name="whipe" 
                >
                    Supprimer
                </Button>
            </Flex>
        </form>
    </Frame>
</Stack>
