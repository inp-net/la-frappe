<script lang="ts">

    import { signIn } from "@auth/sveltekit/client";
    import { Button, Stack, Flex } from 'azucar-ui';
    import { CircleArrowRight } from '@lucide/svelte';
    import type { PageData } from './$types';

    interface Props {
        data: PageData;
    }
    let { data }: Props = $props();


</script>

<svelte:head>
    <title>
        La Frappe · Connexion
    </title>
</svelte:head>

<!--
    Page de login.
    La page de navigation se trouve dans /browse
-->

<Flex direction="column" gap="xl" margin="lg" align="center" style="max-width: 500px; margin: auto; margin-top: 5rem;">
    <Stack>
        <Flex>
            <Button icon={CircleArrowRight} onclick={() => signIn("authentik", { redirectTo: "/browse" })}>
                {#if data.isFakeAuth}
                    Se connecter (Mode Test Local)
                {:else}
                    Se connecter avec Authentik
                {/if}
            </Button>
        </Flex>
    </Stack>
</Flex>
