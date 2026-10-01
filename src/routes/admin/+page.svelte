<script lang="ts">
    import { Check, Search, Plus, X, Gavel} from '@lucide/svelte';
    import type { PageData } from './$types';
    import type { FileData, SubjectMetadata } from '$lib/types/types.d';
    import { Stack, Flex, TextInput, Button, Switch, Details, Frame } from 'azucar-ui';

    let { data }: { data: PageData } = $props();

    let file = $state<FileList | undefined>(undefined);

    // UEs
    const ue: FileData[] = $derived(data.ue ?? []);
    const ueNames = $derived(ue?.map((u) => u.name) ?? []);
    let ueSelected: FileData | undefined = $state();
    let ueSearched: string = $state("");
    let metadata: SubjectMetadata | null = $state(null);

    let ueNameChange: string = $state("");

    let paths: string[] = $state([]);

    $effect(() => {
        ueNameChange = ueSelected?.name ?? "";
    });

    /** Recherche des UEs. */
    async function handleSearch(event?: Event) {
        event?.preventDefault();

        const foundUe = ue.find((u) => u.name === ueSearched);
        ueSelected = foundUe;

        if (!ueSearched.trim()) return;

        try {
            const response = await fetch(`/api/metadata/get?name=${encodeURIComponent(ueSearched)}`);
            if (!response.ok) throw new Error('Impossible de récupérer les métadonnées');

            metadata = await response.json();
            ueNameChange = ueSearched;

            metadata?.paths?.forEach((path, i) => paths[i] = path)
        } catch (err) {
            metadata = null;
        }
    }


    // banlist
    const banlist: string[] = $derived(data.bans);
    let banSearched: string = $state("");
    const banlistSearched: string[] = $derived(
        banlist
            .filter(n => n.startsWith(banSearched))
    );
</script>

{#snippet list(bindPaths?: string[])}
    <Stack gap="xs">
        <p>Paths</p>
        {#if bindPaths}
            {#each bindPaths as _, i}
                <Flex gap="xxs">
                    <TextInput name="paths" bind:value={bindPaths[i]} placeholder="/mon/chemin" style="flex-grow: 1;" />
                    <Button type="button" variant='outline' icon={X} onclick={() => bindPaths.splice(i, 1)} />
                </Flex>
            {/each}

            <Button 
                type="button"
                icon={Plus} 
                variant="outline" 
                onclick={() => bindPaths.push('')}
            >
                Ajouter un path
            </Button>
        {/if}
    </Stack>
{/snippet}

<Stack gap="xxl" style="padding: var(--size-md); width: 100%; max-width: min(100%, 800px); margin: 0 auto;">
    <h2>Admin board</h2>

    <Stack>

        <!-- gestion base de donnes -->

        <h3>Gestion de la base de donnée</h3>
        <Details summary="Importer un JSON" framed={true} border={true}>
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
        </Details>

        <!-- modifier des UEs -->

        <Details summary="Modifier des UEs" framed={true} border={true}>
            <Stack gap="lg">
                <TextInput
                    icon={Search}
                    id="ue"
                    options={ueNames}
                    placeholder="Réseau"
                    bind:value={ueSearched}
                    onchange={handleSearch}
                >
                    Rechercher une UE
                </TextInput>
                
                {#if ueSelected && metadata}
                    <form method="POST" action="?/editMetadata">
                        <input type="hidden" name="originalName" value={ueSelected.name} />

                        <Stack gap="md">
                            <TextInput
                                name="newName"
                                placeholder="technologie objet"
                                bind:value={ueNameChange}
                            >
                                Nom de l'UE
                            </TextInput>
                            
                            {@render list(metadata.paths)}
                            
                            <Flex gap="xs" style="flex-grow: 1" justify='right'>
                                <Button 
                                    type="submit"
                                    icon={Check} 
                                    class="success" 
                                >
                                    Modifier
                                </Button>
                            </Flex>
                        </Stack>
                    </form>
                {/if}
            </Stack>
        </Details>

        <!-- générer l'arbre -->

        <Details summary="Générer l'arbre" framed={true} border={true}>
            <form method="POST" action="?/genTree">
                <Flex>
                    <Button 
                        type="submit"
                        icon={Check} 
                        class="success" 
                        name="Success" 
                    >
                        Générer l'arbre
                    </Button>
                </Flex>
            </form>
        </Details>
    </Stack>

    <Stack>
        <h3>Gestion des utilisateurs</h3>

        <!-- bannir des gens -->

        <Details summary="Bannir des utilisateurs" framed={true} border={true}>
            <Stack gap="lg">
                <form method="POST" action="?/ban">
                    <Flex align="end" gap="xs">
                        <TextInput
                            icon={Search}
                            id="name"
                            name="name"
                            options={banlist}
                            placeholder="88db"
                            bind:value={banSearched}
                            onchange={handleSearch}
                            style="flex-grow: 1"
                        >
                            Identifiant de l'utilisateur
                        </TextInput>
                        <Button
                            icon={Gavel}
                            class="danger"
                            type="submit"
                        >Bannir</Button>
                    </Flex>
                </form>
                <Stack gap="xs">
                    <p>Liste des bannis - {banlist.length} utilisateur(s)</p>
                    {#if banlist.length > 0}
                        {#each banlistSearched.slice(0, 9) as ban}
                            <form method="POST" action="?/unban">
                                <input type="hidden" name="name" value={ban} />

                                <Frame style="padding: var(--size-xs) var(--size-sm);" border>
                                    <Flex justify="space-between" align="center">
                                        <p>{ban}</p>
                                        <Button type="submit" variant="ghost" icon={X}></Button>
                                    </Flex>
                                </Frame>
                            </form>
                        {/each}
                    {/if}
                </Stack>
            </Stack>
        </Details>

    </Stack>

    <div style="height: 10rem;"></div>
</Stack>
