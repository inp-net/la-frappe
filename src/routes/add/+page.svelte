<script lang='ts'>

    import { FOLDER } from '$lib/constants/index';

    import {
        Button,
            Flex,
            Stack,
            ButtonGroup,
            TextInput,
            Frame
    } from 'azucar-ui';

    import {
        SearchIcon,
        Paperclip
    } from '@lucide/svelte';

</script>

<Flex direction="column" gap="xxl" margin="lg">

    <Stack>
        <Flex>
        <h1>Ajouter un fichier</h1>
        </Flex>
        <p>Ajouter un fichier à la base de données.</p>
    </Stack>

    <Stack>
        <Frame>
        <Flex gap="md" direction="columns">
            <Flex gap="md" align="center">
                <span>Ajouter le fichier :</span>
                <Flex gap="xs" align="center">
                    <Button variant="outline" icon={Paperclip}>Ajouter</Button>
                    <span>Nom_Fichier.pdf</span>
                </Flex>
            </Flex>
            <Flex gap="md" wrap={true}>
                <TextInput type="text" name="Test" placeholder="Nom...">Nom du fichier</TextInput>
                <TextInput type="search" icon={SearchIcon} placeholder="ENSEEIHT, ...">École</TextInput>
                <TextInput type="search" icon={SearchIcon} placeholder="Partiel, ...">Type de fichier</TextInput>
            </Flex>
            <Flex gap="xs" style="flex-grow: 1" justify='right'>
                <Button variant="outline" href={FOLDER.DEFAULT_PAGE_LOCATION}>Quitter</Button>
                <Button class="success" name="Success">Valider</Button>
            </Flex>
        </Flex>
        </Frame>
    </Stack>
    <Stack>
    </Stack>

</Flex>

<style>
    
    .left {
        flex-grow: 1;
        justify-content: "right";
    }

</style>
