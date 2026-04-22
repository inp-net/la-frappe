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
        Paperclip,
        Check
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
        <Flex gap="md" direction="column">
            <!-- fichier -->
            <Flex gap="md" align="center">
                <span>Ajouter un fichier :</span>
                <Flex gap="xs" align="center">
                    <Button variant="outline" icon={Paperclip}>Ouvrir</Button>
                    <span>Nom_Fichier.pdf</span>
                </Flex>
            </Flex>
            <!-- inputs -->
            <Flex gap="md">
                <TextInput type="text" placeholder="Nom...">Nom du fichier</TextInput>
                <TextInput type="search" icon={SearchIcon} placeholder="ENSEEIHT, ...">École</TextInput>
                <TextInput type="search" icon={SearchIcon} placeholder="SN, ...">Filiaire</TextInput>
                <Flex direction="column" gap="xxs">
                    <span>Année</span>
                    <ButtonGroup>
                        <Button>1A</Button>
                        <Button variant="outline">2A</Button>
                        <Button variant="outline">3A</Button>
                    </ButtonGroup>
                </Flex>
                <TextInput type="search" icon={SearchIcon} placeholder="Architecture, ...">Martière</TextInput>
                <TextInput type="search" icon={SearchIcon} placeholder="Partiel, ...">Type de fichier</TextInput>
            </Flex>
            <!-- bouton-ajouter -->
            <Flex gap="xs" style="flex-grow: 1" justify='right'>
                <Button variant="outline" href={FOLDER.DEFAULT_PAGE_LOCATION}>Annuler</Button>
                <Button icon={Check} class="success" name="Success">Ajouter</Button>
            </Flex>
        </Flex>
        </Frame>
    </Stack>
    <Stack>
    </Stack>

</Flex>

<style>

</style>
