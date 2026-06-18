<script lang="ts">

    import { signIn } from "@auth/sveltekit/client";

    import {
        Button,
        Stack,
        Flex
    } from 'azucar-ui';

</script>

<Flex direction="column" gap="xl" margin="lg">
    <Stack>
        <h1>La Frappe</h1>
        <p>Explorateur de partiels.</p>
        <Flex>
        <Button onclick={() => signIn("authentik", { callbackUrl: "/browse/" })}> Se connecter </Button>
        </Flex>
    </Stack>
</Flex>
