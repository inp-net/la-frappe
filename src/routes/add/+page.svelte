<script lang='ts'>

    import { FOLDER } from '$lib/constants/index';
    import { categoriesAccepted } from '$lib/tools/filtre';
    import Select from '$lib/components/Select.svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import { untrack } from 'svelte';

    import {
        Button,
            Flex,
            Stack,
            ButtonGroup,
            Frame,
            Switch
    } from 'azucar-ui';

    import {
        SearchIcon,
        Paperclip,
        Check,
        Info
    } from '@lucide/svelte';

    let { data }: { data: PageData } = $props();

    // Element séléctionné par l'utilisateur

    let fileList = $state<FileList | undefined>(undefined);
    let selectedSchool = $state("");
    let selectedFiliaire = $state("");
    let selectedYear = $state("1A");
    let selectedCourse = $state("");
    let selectedDocumentType = $state("");
    let selectedDate = $state(2026);
    let haveCorrige = $state(false);

    // Liste des éléments qui peuvent être séléctionné

    let fileToUpload = $derived(fileList?.[0]);
    let schoolList = $derived(data.schoolNames);
    let filiaireList = $state<string[]>([]);
    let courseList = $state<string[]>([]);
    let documentTypes: string[] = $derived([...categoriesAccepted]);

    let showSuccess = $state(false);
    let showFailure = $state(false);

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
        const school = selectedSchool;
        const year = selectedYear;
        const filiaire = selectedFiliaire;

        if (school && year) {
            getNextSelection(`${school}/${year}`).then(list => {
                filiaireList = list;
                untrack(() => {
                    if (!list.includes(selectedFiliaire)) {
                        selectedFiliaire = "";
                    }
                });
            });
        }
        if (school && year && filiaire) {
            getNextSelection(`${school}/${year}/${filiaire}`).then(list => {
                courseList = list;
                untrack(() => {
                    if (!list.includes(selectedCourse)) {
                        selectedCourse = "";
                    }
                });
            });
        }
    });

    async function sendFile() {
        if (!fileToUpload || !selectedSchool || !selectedCourse || !selectedFiliaire) {
            console.error("Formulaire incomplet");
            showFailure = true;
            return;
        }
        let formData = new FormData();
		formData.append('file', fileToUpload);
		formData.append('school', selectedSchool);
		formData.append('year', selectedYear);
		formData.append('subject', selectedCourse);
		formData.append('filiaire', selectedFiliaire);
		formData.append('category', selectedDocumentType);
		formData.append('date', selectedDate.toString());
        formData.append('corrige', haveCorrige.toString());
		try {
			const response = await fetch('/api/document', {
				method: 'POST',
				body: formData
			});
            if (response.ok) {
                const result = await response.json();
                showSuccess = true;
                setTimeout(() => {
                    goto(FOLDER.DEFAULT_PAGE_LOCATION); 
                }, 2000);
            } else {
                const errorData = await response.json();
                showFailure = true;
            }
		} catch (err) {
			console.error("Erreur lors de l'envoi du form : ", err);
            showFailure = true;
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
            <Flex gap="md" align="center">
                <Select
                    options={schoolList}
                    bind:value={selectedSchool}
                    icon={SearchIcon}
                    placeholder="Choisir une école"
                    required
                >École</Select>
                <Flex direction="column" gap="xxs">
                    <span>Année</span>
                    <ButtonGroup>
                        <Button
                            variant={selectedYear === "1A" ? 'default' : 'outline'}
                            onclick={() => selectedYear = "1A"}
                        >1A</Button>
                        <Button
                            variant={selectedYear === "2A" ? 'default' : 'outline'}
                            onclick={() => selectedYear = "2A"}
                        >2A</Button>
                        <Button
                            variant={selectedYear === "3A" ? 'default' : 'outline'}
                            onclick={() => selectedYear = "3A"}
                        >3A</Button>
                    </ButtonGroup>
                </Flex>
                <Select
                    options={filiaireList}
                    bind:value={selectedFiliaire}
                    icon={SearchIcon}
                    placeholder="Choisir une filiaire"
                    disabled={!selectedSchool}
                    required
                >Filiaire</Select>
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
                <Flex direction="column" gap="xxs">
                    <span>Année du TD</span>
                    <input type="number" bind:value={selectedDate} min="1900" max="2100" placeholder="2026"/>
                </Flex>
                <Flex direction="column" gap="xxs">
                    <span>Contient corrigé ?</span>
                    <Switch bind:checked={haveCorrige}/>
                </Flex>
            </Flex>
            <Flex gap="xs" direction="column">
                <Flex gap="xs" align="center">
                    <Info size="10px"/>
                    <span>Le corrigé (si disponible) doit être fusionné avec le sujet.</span>
                </Flex>
            </Flex>
            <!-- bouton-ajouter -->
            <Flex gap="xs" style="flex-grow: 1" justify='right'>
                <Button variant="outline" href={FOLDER.DEFAULT_PAGE_LOCATION}>Annuler</Button>
                <Button icon={Check} class="success" name="Success" onclick={sendFile}>Ajouter</Button>
            </Flex>
        </Flex>
        </Frame>
    </Stack>
    <Stack>
    </Stack>

</Flex>
