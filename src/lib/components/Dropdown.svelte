<script lang="ts">
    import { Frame, Stack } from 'azucar-ui';
    import type { HTMLAttributes } from 'svelte/elements';

    type Props = HTMLAttributes<HTMLElement> & {
        menu?: string[];
        align?: 'center' | 'left' | 'right';
        eventAction?: (value: string) => void;
        id?: string;
    };

    let {
        menu = [],
        align = 'center',
        eventAction,
        id = 'mainpopover',
        children,
        ...rest
    }: Props = $props();

    let flexName = (s: string) => {
        if (s === 'center') {
            return 'center';
        } else if (s === 'left') {
            return 'flex-start';
        } else {
            return 'flex-end';
        }
    };

    let mainpopover: HTMLElement | null = $state(null);

    function handleClick(action: string) {
        if (eventAction) eventAction(action);

        if (mainpopover) mainpopover.hidePopover();
    }
</script>

{#if children}
    {@render children()}
{/if}

<div
    bind:this={mainpopover}
    class="frame"
    popover="auto"
    {id}
    style={`
        justify-content: ${align};
        align-items: ${flexName(align)};
    `}
>
    <Frame
        border={true}
        transparent={true}
        style="padding: 1px; border-radius: calc(var(--corner-radius) / 2);"
    >
        <Stack gap="zero">
            {#each menu as item}
                <button class="dropdown-item" onclick={() => handleClick(item)}>
                    {item}
                </button>
            {/each}
        </Stack>
    </Frame>
</div>

<style>
    .frame {
        position-anchor: auto;
        top: anchor(bottom);
        left: anchor(center);
        justify-self: anchor-center;
        translate: -50% 4px;
        border: none;
        background: transparent;
        padding: 0;
        width: fit-content;
        min-width: 5vw;
        margin: 0;
        filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15));
        transition:
            opacity 120ms ease,
            transform 120ms ease;
    }

    @starting-style {
        .frame {
            opacity: 0;
            transform: translateY(-4px);
        }
    }

    .frame:popover-open {
        display: flex;
        flex-direction: column;
    }

    .dropdown-item {
        padding: var(--size-xs) var(--size-md);
        text-align: left;
        color: var(--color-fg-low);
        border-radius: calc(var(--corner-radius) / 2);
    }

    .dropdown-item:hover {
        background-color: var(--color-bg-hover);
    }

    
    button {
        border: none;
        margin: 0;
        padding: 0;
        width: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
        font: inherit;
        line-height: normal;
        -webkit-font-smoothing: inherit;
        -moz-osx-font-smoothing: inherit;
        -webkit-appearance: none;
    }
</style>
