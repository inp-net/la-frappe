<!-- Ce composant à été réalisé par IA par contrainte de temps. Il sera entièrement -->
<!-- refait lors de l'update Azucar. -->

<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Snippet } from 'svelte';

    type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
        items: string[];
        onselect: (item: string) => void;
        children: Snippet;
        align?: 'left' | 'right';
        position?: 'bottom' | 'top';
    };

    let {
        items,
        onselect,
        children,
        align = 'left',
        position = 'bottom',
        class: className = '',
        ...rest
    }: Props = $props();

    let isOpen = $state(false);
    let rootEl: HTMLDivElement | undefined = $state();

    function toggle(e: MouseEvent) {
        // Prevent the click from propagating to the document listener in the same tick
        e.stopPropagation();
        isOpen = !isOpen;
    }

    function handleSelect(item: string) {
        onselect(item);
        isOpen = false;
    }

    function handleWindowClick(e: MouseEvent) {
        if (isOpen && rootEl && !rootEl.contains(e.target as Node)) {
            isOpen = false;
        }
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && isOpen) {
            isOpen = false;
        }
    }
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<div bind:this={rootEl} class="dropdown-root" {...rest}>
    <!-- Captures the click bubbling up from <Button> and toggles -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="dropdown-trigger" onclick={toggle}>
        {@render children()}
    </div>

    {#if isOpen}
        <ul
            class={`dropdown-menu dropdown-${position} dropdown-align-${align} ${className}`}
            role="menu"
        >
            {#each items as item}
                <li role="none">
                    <button
                        type="button"
                        role="menuitem"
                        class="dropdown-item"
                        onclick={() => handleSelect(item)}
                    >
                        {item}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .dropdown-root {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
    }

    .dropdown-trigger {
        display: inline-flex;
        cursor: pointer;
    }

    .dropdown-menu {
        position: absolute;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        min-width: 10rem;
        max-width: 18rem;
        width: max-content;
        margin: 0;
        padding: var(--size-xs, 0.25rem);
        list-style: none;
        background: var(--color-bg, #ffffff);
        color: var(--color-fg-high, #1a1a1a);
        border: 1px solid var(--color-border, #e5e7eb);
        border-radius: var(--corner-radius, 0.5rem);
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.08),
            0 10px 15px -3px rgba(0, 0, 0, 0.08);
        transition:
            opacity 120ms ease,
            transform 120ms ease;
    }

    /* Vertical placements */
    .dropdown-bottom {
        top: calc(100% + 0.35rem);
    }

    .dropdown-top {
        bottom: calc(100% + 0.35rem);
    }

    /* Horizontal alignments */
    .dropdown-align-left {
        left: 0;
    }

    .dropdown-align-right {
        right: 0;
    }

    /* Entry animation */
    @starting-style {
        .dropdown-bottom {
            opacity: 0;
            transform: translateY(-4px);
        }
        .dropdown-top {
            opacity: 0;
            transform: translateY(4px);
        }
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0.5rem 0.75rem;
        font: inherit;
        font-size: 0.875rem;
        text-align: left;
        color: inherit;
        background: transparent;
        border: none;
        border-radius: calc(var(--corner-radius, 0.5rem) - 2px);
        cursor: pointer;
        white-space: nowrap;
    }

    .dropdown-item:hover,
    .dropdown-item:focus-visible {
        background-color: var(--color-bg-hover, #f3f4f6);
        outline: none;
    }
</style>
