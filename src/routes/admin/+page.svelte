<script lang="ts">
    import { Check, Search, Plus, X} from '@lucide/svelte';
    import type { PageData } from './$types';
    import type { FileData, SubjectMetadata } from '$lib/types/types.d';
    import { Stack, Flex, TextInput, Button, Switch, Details } from 'azucar-ui';

    let { data }: { data: PageData } = $props();

    let file = $state<FileList | undefined>(undefined);

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

<Stack gap="xxl" style="padding: var(--size-md); max-width: min(100%, 800px); margin: 0 auto;">
    <h2>Admin board</h2>

    <Stack>
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
    </Stack>
</Stack>
