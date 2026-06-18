<script lang="ts">
    import type { Icon } from '@lucide/svelte';
    import type { HTMLSelectAttributes } from 'svelte/elements';
    import { ChevronDown } from '@lucide/svelte';

    type Props = HTMLSelectAttributes & {
        options: string[];
        icon?: typeof Icon;
        value: string;
        placeholder?: string;
        disabled?: boolean;
    };

    let { 
        options = [], 
        value = $bindable(), 
        icon, 
        children, 
        placeholder,
        disabled = false,
        class: className, 
        ...rest 
    }: Props = $props();

    const classes = $derived(
        ['text-input', icon && 'text-input-has-icon', className].filter(Boolean).join(' ')
    );
</script>

<label class={classes}>
    {#if children}
        <span class="label">
            {@render children?.()}
            {#if rest.required}
                <span class="required-star" aria-hidden="true">*</span>
            {/if}
        </span>
    {/if}

    <div class="input-wrapper" data-disabled={disabled}>
        {#if icon}
            {@const Icon = icon}
            <span class="text-input-icon">
                <Icon size="1rem" aria-hidden="true" />
            </span>
        {/if}

        <select bind:value {disabled} {...rest}>
            {#if placeholder}
                <option value="" disabled selected>{placeholder}</option>
            {/if}
            {#each options as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
        
        <ChevronDown size="1em" style="position: absolute; justify-content: left; right: 1em; pointer-events: none;"/>
        
    </div>
</label>

<style>
    .text-input {
        display: inline-flex;
        flex-direction: column;
        gap: var(--size-xxs);
        width: 100%
    }

    .label {
        font: inherit;
        width: 100%
    }

    @media (min-width: 768px) {
        .text-input {
            width: 25% 
        }
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--gap-icon);
        color: var(--color-fg-low);
        line-height: 1.25;
        font: inherit;
        padding: var(--padding-y-icon) var(--size-md);
        background-color: var(--color-bg-subtle);
        box-shadow: inset 0 0 0 1px var(--color-border);
        border-radius: var(--corner-radius);
        transition: opacity 0.2s ease, box-shadow 0.2s ease;
    }

    .text-input-icon {
        display: inline-flex;
        align-items: center;
        pointer-events: none; 
        color: var(--color-border-subtle);
    }

    .select-chevron {
        position: absolute;
        justify-content: left;
        right: 5em;
        pointer-events: none; 
    }

    .input-wrapper select {
        flex-grow: 1;
        appearance: none;
        background: transparent;
        border: none;
        font: inherit;
        color: inherit;
        outline: none;
        cursor: pointer;
    }

    .text-input-has-icon .input-wrapper {
        padding-left: var(--padding-x-icon);
    }

    .select-arrow {
        position: absolute;
        right: var(--size-sm);
        width: 0.45em;
        height: 0.45em;
        border-right: 1.5px solid var(--color-border-subtle);
        border-bottom: 1.5px solid var(--color-border-subtle);
        transform: rotate(45deg);
        pointer-events: none;
        margin-top: -0.25em;
    }

    .input-wrapper:has(select:focus-visible):not([data-disabled="true"]) {
        box-shadow: inset 0 0 0 1px var(--color-border-focus);
    }

    .input-wrapper[data-disabled="true"] {
        --base-color: var(--color-neutral);
        cursor: not-allowed;
        box-shadow: inset 0 0 0 1px var(--color-border-subtle);
        background-color: var(--color-bg);
    }

    .input-wrapper[data-disabled="true"] select {
        cursor: not-allowed;
        color: var(--color-border-subtle);
    }

    .required-star {
        color: var(--color-danger);
    }

    .input-wrapper select:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 4px;
    }
</style>
