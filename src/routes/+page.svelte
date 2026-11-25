<script lang="ts">
    import { signIn } from "@auth/sveltekit/client";
    import { Button, Stack, Flex, Frame } from 'azucar-ui';
    import { CircleArrowRight } from '@lucide/svelte';
    import type { PageData } from './$types.js';
    import Logo from '#lib/components/Logo.svelte';

    interface Props {
        data: PageData;
    }
    let { data }: Props = $props();

    const imageModules = import.meta.glob<{ default: string }>(
        '$lib/assets/examples/*.webp', { eager: true }
    );

    const allImages = Object.values(imageModules).map((mod) => mod.default);

    const randomThree = [...allImages]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
</script>

<svelte:head>
    <title>
        La Frappe · Connexion
    </title>
</svelte:head>

<Logo />

<!--
    Page de login.
    La page de navigation se trouve dans /browse
-->

<div class="page-wrapper">
    <Flex direction="column" gap="xl" align="center" style="max-width: 800px; width: 100%; margin: 1rem auto 0;">
        <Flex justify="center" align="center" gap="md" wrap={false} style="width: 100%;">
            {#each randomThree as src, i}
                <img class="example-img" {src} alt="Example {i + 1}" style={`margin-top: calc(var(--size-xl) * ${i-1})`} />
            {/each}
        </Flex>
        <div class="login-frame">
            <Frame transparent>
                <Stack align="center" gap="lg" margin='lg'>
                    <img class='wordmark' src='inpnet-wordmark.svg' alt='inpnet-logo' />
                    <Flex>
                        <p>Service proposé par net7 pour INP-net.</p>
                    </Flex>
                    <Flex>
                        <Button icon={CircleArrowRight} onclick={() => signIn("authentik", { redirectTo: "/browse" })}>
                            {#if data.isFakeAuth}
                                Se connecter (Mode Test Local)
                            {:else}
                                Se connecter
                            {/if}
                        </Button>
                    </Flex>
                </Stack>
            </Frame>
        </div>
    </Flex>
</div>

<br style="height: 10rem;" />

<style>
    .page-wrapper {
        width: 100%;
        overflow-x: hidden;
        padding-bottom: 2rem;
    }

    .wordmark {
        width: 80%;
    }

    .example-img {
        flex: 1 0 180px;
        min-width: 180px;
        height: auto;
        aspect-ratio: 210 / 297;
        object-fit: cover;
        border-radius: 0.5rem;
        position: relative;
        z-index: 1;
    }

    .login-frame {
        position: relative;
        z-index: 2;
        margin-top: calc(var(--size-xl) * -3);
        padding: 0 1rem;
    }
</style>
