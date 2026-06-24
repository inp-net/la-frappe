<script lang="ts">

    import { signIn } from "@auth/sveltekit/client";
    import { Button, Stack, Flex } from 'azucar-ui';
    import { CircleArrowRight } from '@lucide/svelte';
    import type { PageData } from './$types';

    interface Props {
        data: PageData;
    }
    let { data }: Props = $props();

    function handleLogin() {
        if (data.isFakeAuth) {
            window.location.reload();
        } else {
            signIn("authentik", { redirectTo: "/browse" });
        }
    }

</script>

<Flex direction="column" gap="xl" margin="lg" align="center" style="max-width: 500px; margin: auto; margin-top: 5rem;">
    <Stack>
        <Flex align="center" wrap={false}>
            <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.59091 16L15.9298 19.7636L7.5 25H17.5" stroke="#FF00B8" stroke-width="3" stroke-linecap="square" stroke-linejoin="bevel"/>
                <path d="M24.5 6.5V25L23 26.5H18.5V23.5H21.5V8H10V11H7V6.5L8.5 5H23L24.5 6.5Z" fill="var(--color-fg-high)"/>
            </svg>
            <Flex direction="column" gap="xxs">
                <h1>La Frappe</h1>
                <p>Explorateur de partiels.</p>
            </Flex>
        </Flex>
    </Stack>
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
