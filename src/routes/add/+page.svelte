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

    // Element séléctionné par l'utilisateur

    let fileList = $state<FileList | undefined>(undefined);
    let selectedSchool = $state("");
    let selectedFiliaire = $state("");
    let selectedYear = $state("1A");
    let selectedCourse = $state("");
    let selectedDocumentType = $state("");

    // Liste des éléments qui peuvent être séléctionné

    let fileToUpload = $derived(fileList?.[0]);
    let schoolList = $derived(data.schoolNames);
    let filiaireList = $state<string[]>([]);
    let courseList = $state<string[]>([]);
    let documentTypes: string[] = $derived([...categoriesAccepted]);

    /** Fonction qui récupère une liste des noms de fichiers à partir du chemin
    * relatif dans la DB. Utilise l'api dirs.
    * @param selected : string chemin relatif dans la DB.
    * @return string[] liste des noms des fichiers contenues à cet endroit.
    * @throws Error si le chemin n'existe pas.
    */
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

    // Met à jour la séléction possible matières/filiaires en temps réel en
    // fonction de la séléction précédentes.
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

    async function sendFile() {
        if (!fileToUpload|| !selectedSchool || !selectedCourse) {
            console.error("Formulaire incomplet");
            return;
        }
        let formData = new FormData();
		formData.append('file', fileToUpload);
		formData.append('school', selectedSchool);
		formData.append('year', selectedYear);
		formData.append('subject', selectedCourse);
		formData.append('category', selectedDocumentType);
		try {
			const response = await fetch('/api/document', {
				method: 'POST',
				body: formData
			});
			console.log(await response.json());
		} catch (err) {
			console.error("Erreur lors de l'envoi du form : ", err);
		}
    }

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
                    <input
                        type="file"
                        id="document"
                        name="document"
                        accept="image/*,.pdf"
                        bind:files={fileList}
                    />
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
                    bind:value={selectedDocumentType}
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
