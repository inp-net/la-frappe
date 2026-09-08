<script lang='ts'>

    import { DocumentTypes, StoragePaths, type SubjectData } from '$lib/types/types.d';
    import Select from '$lib/components/Select.svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    import { Toaster, toast } from 'svelte-sonner';

    import { Button, Flex, Stack, ButtonGroup, Frame, Switch, TextInput } from 'azucar-ui';

    import { TriangleAlert, SearchIcon, Check, Info, Bug } from '@lucide/svelte';

    let { data }: { data: PageData } = $props();

    // Element séléctionné par l'utilisateur

    let fileList = $state<FileList | undefined>(undefined);

    // ENSEEIHT, ...
    let selectedSchool = $state("");
    // Département (SN, 3EA, MF2E)
    let selectedMajor = $state("");
    // FISE / FISA
    let selectedTrack = $state("");
    // Année
    let selectedYear = $state("1A");
    // UE
    let selectedMinor = $state("");
    // Matière (optionel par exemple quand UE = Matière)
    let selectedCourse = $state("");
    // Partiel, Cours, ...
    let selectedDocumentType = $state("");
    // Année du document
    let selectedDate = $state(new Date().getFullYear());
    // As le corrigé
    let hasCorrection = $state(false);

    // Liste des éléments qui peuvent être séléctionné

    let fileToUpload = $derived(fileList?.[0]);
    let schoolList = $derived(data.schoolNames);
    let documentTypes: string[] = $derived([...Object.values(DocumentTypes)]);

    let majorList = $state<string[]>([]);
    let trackList = $state<string[]>([]);
    let courseList = $state<string[]>([]);
    let minorList = $state<string[]>([]);

    const dependencyGraph = [
        {
            get value() { return selectedMajor; },
            get options() { return majorList; },
            set options(val) { majorList = val; },
            get keys() { return [selectedSchool]; },
            path: (deps: string[]) => `${deps[0]}`,
            reset: () => selectedMajor = ""
        },
        {
            get value() { return selectedTrack; },
            get options() { return trackList; },
            set options(val) { trackList = val; },
            get keys() { return [selectedSchool, selectedMajor]; },
            path: (deps: string[]) => `${deps[0]}/${deps[1]}`,
            reset: () => selectedTrack = ""
        },
        {
            get value() { return selectedMinor; },
            get options() { return minorList; },
            set options(val) { minorList = val; },
            get keys() { return [selectedSchool, selectedMajor, selectedTrack, selectedYear]; },
            path: (deps: string[]) => `${deps[0]}/${deps[1]}/${deps[2]}/${deps[3]}`,
            reset: () => selectedMinor = ""
        },
        {
            get value() { return selectedCourse; },
            get options() { return courseList; },
            set options(val) { courseList = val; },
            get keys() { return selectedMinor ?
                [selectedSchool, selectedMajor, selectedTrack, selectedYear, selectedMinor] :
                [selectedSchool, selectedMajor, selectedTrack, selectedYear];
            },
            path: (deps: string[]) => selectedMinor ? `${deps[0]}/${deps[1]}/${deps[2]}/${deps[3]}/${deps[4]}` : `${deps[0]}/${deps[1]}/${deps[2]}/${deps[3]}`,
            reset: () => selectedCourse = ""
        }
    ];

    /** Fonction qui récupère une liste des noms de fichiers à partir du chemin
     * relatif dans la DB. Utilise l'api get-files-at.
     * @param selected : string chemin relatif dans la DB.
     * @return string[] liste des noms des fichiers contenues à cet endroit.
     * @throws Error si le chemin n'existe pas.
     */
    async function fetchSelectionOptions(subPath: string): Promise<string[]> {
        try {
            const pathParam = `${StoragePaths.DEFAULT_DB_LOCATION}/${subPath}/`;
            const response = await fetch(`/api/get-files-at?path=${encodeURIComponent(pathParam)}`);
            if (!response.ok) return [];
            const files: { name: string; isDirectory: boolean }[] = await response.json();
            return files.map(item => item.name);
        } catch {
            return [];
        }
    }

    /** Fonction qui récupère les fichiers en fonction du nom de l'UE.
     * Le nom d'un UE est unique et sont stockés dans /uploads.
     * Utilisé pour vérifié que le nom est pas déjà pris.
     * @param name : string nom de l'UE.
     * @return string[] : chemins qui pointent à l'UE.
     * @throws Error si l'UE n'existe pas ou n'a pas de chemins.
     */
    async function fetchCourse(name: string): Promise<SubjectData> {
        const response = await fetch(`/api/get-course?name=${encodeURIComponent(name)}`);
        if (!response.ok) throw new error(400, 'UE introuvable');
        const data = await response.json();
        return data as SubjectData;
    }

    // Met à jour la séléction possible matières/filières en temps réel en
    // fonction de la séléction précédentes.
    $effect(() => {
        const _trigger = [selectedSchool, selectedMajor, selectedTrack, selectedYear, selectedMinor];

        const timer = setTimeout(() => {
            for (const node of dependencyGraph) {
                const currentDeps = node.keys; 
                if (currentDeps.some(dep => !dep)) {
                    node.options = [];
                    node.reset();
                    continue;
                }
                const computedPath = node.path(currentDeps);
                const closurePath = computedPath; 
                fetchSelectionOptions(computedPath).then(list => {
                    if (node.path(node.keys) === closurePath) {
                        node.options = list;
                    }
                });
            }
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    });

    let isSending = $state(false);
    let isCountingDown = $state(false);
    let countdownTimer: ReturnType<typeof setTimeout> | undefined;
    let currentToastId: string | number | undefined = undefined;

    /** Gère l'upload du form. */
    async function executeUpload() {
        isSending = true;
        const loadingToastId = toast.loading("Envoi du formulaire en cours...");

        try {
            const formData = new FormData();
            formData.append('document', fileToUpload as File);
            formData.append('school', selectedSchool);
            formData.append('major', selectedMajor);
            formData.append('track', selectedTrack);
            formData.append('year', selectedYear);
            formData.append('minor', selectedMinor);
            formData.append('course', selectedCourse);
            formData.append('documentType', selectedDocumentType);
            formData.append('date', selectedDate.toString());
            formData.append('hasCorrection', hasCorrection ? "true" : "false");

            const response = await fetch('?/add', {
                method: 'POST',
                body: formData,
                headers: { 'x-sveltekit-action': 'true' }
            });

            const result = await response.json();
            toast.dismiss(loadingToastId);

            if (result.type === 'failure') {
                toast.error("Erreur : " + (result.data?.message || 'Erreur inconnue'));
            } else if (result.type === 'redirect' || response.redirected) {
                toast.success("Formulaire envoyé avec succès !");
                setTimeout(async () => {
                    await invalidateAll();
                    goto(StoragePaths.DEFAULT_PAGE_LOCATION); 
                }, 1000);
            } else if (result.type === 'error') {
                toast.error(`Erreur critique : ${result.error.message}`);
            }
        } catch {
            toast.dismiss(loadingToastId);
            toast.error("Une erreur réseau est survenue.");
        } finally {
            isSending = false;
        }
    }

    /** Evenement lors du clique de Ajouter. */
    function sendFile(event: Event) {
        event.preventDefault();

        if (!fileToUpload || !selectedSchool || !selectedCourse || !selectedMajor || !selectedMinor || !selectedDocumentType) {
            toast.error("Formulaire incomplet.");
            return;
        }

        isCountingDown = true;

        currentToastId = toast('Document prêt', {
            description: "Envoi automatique dans 3s...",
            duration: 3000,
            action: {
                label: 'Valider',
                onClick: () => {
                    clearTimeout(countdownTimer);
                    isCountingDown = false;
                    executeUpload();
                }
            },
            cancel: {
                label: 'Annuler',
                onClick: () => {
                    clearTimeout(countdownTimer);
                    isCountingDown = false;
                    toast("Envoi annulé.");
                }
            },
            onDismiss: () => {
                clearTimeout(countdownTimer);
                isCountingDown = false;
            }
        });

        countdownTimer = setTimeout(() => {
            isCountingDown = false;
            toast.dismiss(currentToastId);
            executeUpload();
        }, 3000);
    }

    /** Trigger si l'utilisateur crée une catégorie inexistante. */
    let isCreating: boolean = $derived(
        (selectedMinor.length > 0 && !minorList.includes(selectedMinor)) ||
        (selectedMajor.length > 0 && !majorList.includes(selectedMajor))
    );

    let alreadyExists = $state(false);
    let pathsToSubject : string[] = $state([]);

    $effect(() => {
        if (!selectedCourse) {
            alreadyExists = false;
            return;
        }

        let active = true;
        const coursePath = `${selectedSchool}/${selectedMajor}/${selectedYear}/${selectedMinor}/`;
        console.log(coursePath);

        const timer = setTimeout(() => {
            fetchCourse(selectedCourse)
                .then((resolvedData) => {
                    if (!active || !resolvedData || resolvedData.paths.length === 0) {
                        alreadyExists = false;
                        return;
                    }

                    const hasNoFiles = resolvedData && Array.isArray(resolvedData) && resolvedData.files?.length === 0;
                    const pathExists = resolvedData.paths?.includes(coursePath);
                    pathsToSubject = resolvedData.paths;

                    if (hasNoFiles || pathExists) {
                        alreadyExists = false;
                    } else {
                        alreadyExists = true;
                    }
                })
                .catch(() => {
                    if (active) alreadyExists = false;
                });
        }, 350);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    });

</script>

<svelte:head>
    <title>La Frappe · Dépôt de documents</title>
</svelte:head>

<Flex direction="column" gap="xxl" margin="lg">

    <Stack>
        <Flex>
        <h2>Ajouter un document</h2>
        </Flex>
        <p>Ajouter un fichier à la base de données.</p>
    </Stack>

    <Stack>
        <Frame>
            <form>
                <Flex gap="lg" direction="column">
                    
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
                        </Flex>
                    </Flex>

                    <Flex gap="md" align="center">
                        <Select
                            name="school"
                            options={schoolList}
                            bind:value={selectedSchool}
                            icon={SearchIcon}
                            type="datalist"
                            placeholder="Choisir une école"
                            id="1"
                            required
                        >École</Select>

                        <Select
                            name="major"
                            options={majorList}
                            bind:value={selectedMajor}
                            icon={SearchIcon}
                            placeholder="Choisir un département"
                            type="datalist"
                            id="2"
                            disabled={!selectedSchool}
                            required
                        >Département</Select>

                        <Select
                            name="track"
                            options={trackList}
                            bind:value={selectedTrack}
                            icon={SearchIcon}
                            placeholder="FISE / FISA"
                            type="datalist"
                            id="3"
                            disabled={!selectedMajor}
                            required
                        >Status étudiant</Select>

                        <Flex direction="column" gap="xxs">
                            <span class="required">Niveau</span>
                            <input type="hidden" name="year" value={selectedYear} />
                            <ButtonGroup>
                                <Button
                                    type="button"
                                    variant={selectedYear === "1A" ? 'default' : 'outline'}
                                    onclick={() => selectedYear = "1A"}
                                >1A</Button>
                                <Button
                                    type="button"
                                    variant={selectedYear === "2A" ? 'default' : 'outline'}
                                    onclick={() => selectedYear = "2A"}
                                >2A</Button>
                                <Button
                                    type="button"
                                    variant={selectedYear === "3A" ? 'default' : 'outline'}
                                    onclick={() => selectedYear = "3A"}
                                >3A</Button>
                            </ButtonGroup>
                        </Flex>

                        {#if selectedYear !== "1A"}
                            <Select
                                name="minor"
                                options={minorList}
                                bind:value={selectedMinor}
                                icon={SearchIcon}
                                placeholder="Choisir une filière"
                                disabled={!selectedMajor}
                                type="datalist"
                                id="4"
                                required
                            >Filière</Select>
                        {/if}

                        <Select
                            name="course"
                            options={courseList}
                            bind:value={selectedCourse}
                            icon={SearchIcon}
                            placeholder="Choisir une matière"
                            disabled={!selectedMinor && !(selectedYear == '1A' && selectedTrack)}
                            type="datalist"
                            id="5"
                        >Matière</Select>

                        <Select
                            name="documentType"
                            options={documentTypes}
                            bind:value={selectedDocumentType}
                            icon={SearchIcon}
                            placeholder="Choisir type doc"
                            required
                        >Type de document</Select>

                        <Flex direction="column" gap="xxs">
                            <TextInput name="date" type="number" bind:value={selectedDate} placeholder="2026-2027" min="1900" max="2100" step="1">Année universitaire</TextInput>
                        </Flex>

                        <Flex direction="column" gap="xxs">
                            <span>Contient corrigé ?</span>
                            <input type="hidden" name="hasCorrection" value={hasCorrection ? "true" : "false"} />
                            <Switch bind:checked={hasCorrection}/>
                        </Flex>

                    </Flex>

                    <Flex gap="xs" direction="column" wrap={false}>
                        <Flex gap="xs" align="baseline" wrap={false}>
                            <Info size="10px"/>
                            <span>Le corrigé (si disponible) doit être fusionné avec le sujet.</span>
                        </Flex>
                        <Flex gap="xs" align="baseline" wrap={false}>
                            <Info size="10px"/>
                            <span>L'année universitaire débute en septembre.</span>
                        </Flex>
                        {#if isCreating}
                            <Flex gap="xs" align="baseline" wrap={false}>
                                <TriangleAlert size="10px" color="red"/>
                                <span>Attention, vous êtes sur le point de crée une nouvelle catégorie.</span>
                            </Flex>
                        {/if}
                        {#if alreadyExists}
                            <Flex gap="xs" align="baseline" wrap={false}>
                                <TriangleAlert size="10px" color="red"/>
                                <Flex direction="column" gap="xxs">
                                    <span>Attention, cette matière existe déjà. <b>Renommez</b> la matière ou cette dernière sera fusionée par défaut.</span>
                                    <span>Confilt avec : </span>
                                    {#each pathsToSubject as path}
                                        <span>- {path}</span>
                                    {/each}
                                </Flex>
                            </Flex>
                        {/if}
                    </Flex>

                    <Flex>
                        <Button icon={Bug} variant="outline" href='/suggest'>Signaler une erreur</Button>
                    </Flex>

                    <Flex gap="xs" style="flex-grow: 1" justify='right'>
                        <Button variant="outline" href={StoragePaths.DEFAULT_PAGE_LOCATION}>Retour</Button>
                        <Button 
                            type="button" 
                            icon={Check} 
                            class="success" 
                            name="Success" 
                            disabled={isSending || isCountingDown} 
                            onclick={sendFile}
                        >
                            Ajouter
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Frame>
    </Stack>

    <Toaster richColors />
</Flex>
