<script lang="ts">
    import { Stack, Frame } from 'azucar-ui';

    let file= $state<FileList | undefined>(undefined);
</script>

<Stack gap="xxl" style="padding: var(--size-md);">
    <h2>Admin board</h2>

    <Frame>
        <Stack gap="lg">
            <h4>Importer UE</h4>
            <form method="POST" action="?/addSubjects" enctype="multipart/form-data">
                <input
                    type="file"
                    id="subjects"
                    name="subjects"
                    accept=".json"
                    bind:files={file}
                />
                <button>Upload</button>
            </form>
        </Stack>
    </Frame>
</Stack>
