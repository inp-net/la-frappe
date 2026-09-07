<script lang="ts">
    import { Check } from '@lucide/svelte';
    import { Stack, Flex, Frame, Button } from 'azucar-ui';

    let file= $state<FileList | undefined>(undefined);
</script>

<Stack gap="xxl" style="padding: var(--size-md);">
    <h2>Admin board</h2>

    <Frame border={true}>
        <Stack gap="lg">
            <h4>Importer UE</h4>

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
                            type="button" 
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
</Stack>
