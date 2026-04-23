<script lang='ts'>

    import { FOLDER } from '$lib/constants/index';
    import { categoriesAccepted } from '$lib/tools/filtre';
    import Select from '$lib/components/Select.svelte';
    import type { PageData } from './$types';

    import {
        Button,
            Flex,
            Stack,
            ButtonGroup,
            Frame
    } from 'azucar-ui';

    import {
        SearchIcon,
        Paperclip,
        Check
    } from '@lucide/svelte';

    let { data }: { data: PageData } = $props();

    let selectedSchool = $state("");
    let selectedFiliaire = $state("");
    let selectedYear = $state("1A");
    let selectedCourse = $state("");
    let selectedDocument = $state("");

    let schoolList = $derived(data.schoolNames);
    let filiaireList = $state<string[]>([]);
    let courseList = $state<string[]>([]);
    let documentTypes: string[] = $derived([...categoriesAccepted]);

    async function getNextSelection(selected : string) {
        if (!selected) {
            return [];
        }
        try {
            const pathParam = `${FOLDER.DEFAULT_DB_LOCATION}/${selected}`;
            const response = await fetch(`/api/dirs?path=${encodeURIComponent(pathParam)}`);
            if (!response.ok) throw new Error('Impossible de récupérer la séléction suivante');
            const data: { name: string; isDirectory: boolean }[] = await response.json();
            const listName = data.map(item => item.name);
            return listName;
        } catch (error) {
            return [];
        }
    }

    $effect(() => {
        if (selectedSchool && selectedFiliaire) {
            getNextSelection(`${selectedSchool}/${selectedFiliaire}`).then(list => {
                courseList = list;
            });
        } else if (selectedSchool) {
            getNextSelection(selectedSchool).then(list => {
                filiaireList = list;
            });
        } else {
            filiaireList = [];
        }
    });

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
                    <input type="file" id="document" name="document" accept="image/*,.pdf" />
                    <!-- <Button variant="outline" icon={Paperclip}>Ouvrir</Button> -->
                    <!-- <span>Nom_Fichier.pdf</span> -->
                </Flex>
            </Flex>
            <!-- inputs -->
            <Flex gap="md">
                <Select
                    options={schoolList}
                    bind:value={selectedSchool}
                    icon={SearchIcon}
                    placeholder="Choisir une école"
                    required
                >École</Select>
                <Select
                    options={filiaireList}
                    bind:value={selectedFiliaire}
                    icon={SearchIcon}
                    placeholder="Choisir une filiaire"
                    disabled={!selectedSchool}
                    required
                >Filiaire</Select>
                <Flex direction="column" gap="xxs">
                    <span>Année</span>
                    <ButtonGroup>
                        <Button>1A</Button>
                        <Button variant="outline">2A</Button>
                        <Button variant="outline">3A</Button>
                    </ButtonGroup>
                </Flex>
                <Select
                    options={courseList}
                    bind:value={selectedCourse}
                    icon={SearchIcon}
                    placeholder="Choisir une matière"
                    disabled={!selectedFiliaire}
                    required
                >Matière</Select>
                <Select
                    options={documentTypes}
                    bind:value={selectedDocument}
                    icon={SearchIcon}
                    placeholder="Choisir type doc"
                    required
                >Type de document</Select>
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

    /* TODO : change style of input file */

</style>
