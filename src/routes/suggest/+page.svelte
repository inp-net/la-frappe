<script lang="ts">
    import { Button, Flex, Stack, Frame, TextInput } from 'azucar-ui';
    import { Toaster, toast } from 'svelte-sonner';
    import { type ErrorData, ErrorInputType, StoragePaths } from '$lib/types/types.d';
    import Select from '$lib/components/Select.svelte';
    import PathInput from '$lib/components/PathInput.svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { Check } from '@lucide/svelte';

    let errorType = $state("");
    let isSending = $state(false);
    
    const errorTypeList = ["Doublon", "Nom incorrect"];

    const errorData: ErrorData[] = [
        {
            name: "Doublon",
            inputNames: ["Chemin 1", "Chemin 2"],
            inputTypes: [ErrorInputType.PATH, ErrorInputType.PATH]
        },
        {
            name: "Nom incorrect",
            inputNames: ["Chemin", "Nouveau nom"],
            inputTypes: [ErrorInputType.PATH, ErrorInputType.NAME]
        }
    ];

    let activeError = $derived(errorData.find(e => e.name === errorType));
    let dynamicFormValues = $state<Record<string, any>>({});

    $effect(() => {
        if (activeError) {
            const initialSetup: Record<string, any> = {};
            activeError.inputNames.forEach((name, i) => {
                if (activeError.inputTypes[i] === ErrorInputType.PATH) {
                    initialSetup[name] = { school: "", major: "", year: "1A", minor: "", course: "" };
                } else {
                    initialSetup[name] = "";
                }
            });
            dynamicFormValues = initialSetup;
        } else {
            dynamicFormValues = {};
        }
    });

    async function handleSend(event: Event) {
        event.preventDefault();

        if (!errorType) {
            toast.error("Veuillez sélectionner un type d'erreur.");
            return;
        }

        isSending = true;
        const loadingToastId = toast.loading("Signalement de l'erreur en cours...");

        try {
            const payload = {
                errorType,
                details: dynamicFormValues
            };

            const response = await fetch('?/report-error', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 
                    'Content-Type': 'application/json',
                    'x-sveltekit-action': 'true' 
                }
            });

            const result = await response.json();
            toast.dismiss(loadingToastId);

            if (result.type === 'failure') {
                toast.error("Erreur : " + (result.data?.message || 'Erreur inconnue'));
            } else {
                toast.success("Signalement envoyé avec succès ! Merci de votre aide.");
                setTimeout(async () => {
                    await invalidateAll();
                    goto(StoragePaths.DEFAULT_PAGE_LOCATION); 
                }, 2000);
            }
        } catch {
            toast.dismiss(loadingToastId);
            toast.error("Une erreur est survenue.");
        } finally {
            isSending = false;
        }
    }
</script>

<svelte:head>
    <title>La Frappe - Suggérer une catégorie</title>
</svelte:head>

<Flex direction="column" gap="xxl" margin="lg">

    <Stack>
        <Flex>
            <h2>Erreur</h2>
        </Flex>
        <p>Aidez-nous : signalez une erreur !</p>
    </Stack>

    <Stack>
        <Frame>
            <form onsubmit={handleSend}>
                <Flex direction="column" gap="lg">
                    <h4>Erreur de catégories</h4>

                    <Select
                        placeholder="Doublon, mauvais nom, ..."
                        bind:value={errorType}
                        options={errorTypeList}
                        required
                    >Type d'erreur</Select>

                    <Flex>
                        {#if activeError && Object.keys(dynamicFormValues).length > 0}
                            <Flex direction="column" gap="md" style="width: 100%">
                                {#each activeError.inputNames as name, i}
                                    <Flex direction="column" gap="xs">
                                        <h5>{name}</h5>
                                        
                                        {#if activeError.inputTypes[i] === ErrorInputType.PATH}
                                            <Frame border={true}>
                                                <PathInput 
                                                    bind:school={dynamicFormValues[name].school}
                                                    bind:major={dynamicFormValues[name].major}
                                                    bind:year={dynamicFormValues[name].year}
                                                    bind:minor={dynamicFormValues[name].minor}
                                                    bind:course={dynamicFormValues[name].course}
                                                />
                                            </Frame>
                                        {:else if activeError.inputTypes[i] === ErrorInputType.NAME}
                                            <TextInput 
                                                placeholder="Saisir le nom corrigé..." 
                                                bind:value={dynamicFormValues[name]} 
                                                required
                                            />
                                        {/if}
                                    </Flex>
                                {/each}
                            </Flex>
                        {/if}
                    </Flex>

                    <Flex gap="xs" style="flex-grow: 1" justify='right'>
                        <Button 
                            variant="outline" 
                            href='/add'
                        >
                            Retour
                        </Button>
                        <Button 
                            type="submit" 
                            icon={Check} 
                            class="success" 
                            disabled={isSending || !errorType}
                        >
                            Valider
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Frame>
    </Stack>

    <Toaster richColors />
</Flex>
