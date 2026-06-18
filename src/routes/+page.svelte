<script lang="ts">

    import { signIn } from "@auth/sveltekit/client";

    import {
        Button,
    } from 'azucar-ui';

</script>

<a href="/browse">
    <Button>Browse Files</Button>

    <Button
        onclick={() => signIn("authentik", { callbackUrl: "/browse/" })}
    >
        Se connecter
    </Button>

</a>
