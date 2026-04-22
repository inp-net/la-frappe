<script lang="ts">
    import type { Icon } from '@lucide/svelte';
    import type { HTMLInputAttributes } from 'svelte/elements';

    type Props = HTMLInputAttributes & {
        options: string[];
        icon?: typeof Icon;
        value: string;
    };

    let { 
        options = [], 
        value = $bindable(), 
        icon, 
        children, 
        class: className, 
        id,
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

    <div class="input-wrapper">
        {#if icon}
            {@const Icon = icon}
            <span class="text-input-icon">
                <Icon size="1rem" aria-hidden="true" />
            </span>
        {/if}

        <input 
            {id}
            list="{id}-list"
            type="text" 
            bind:value 
            {...rest} 
        />

        <datalist id="{id}-list">
            {#each options as option}
                <option value={option}></option>
            {/each}
        </datalist>
    </div>
</label>

<style>
    .text-input {
        display: inline-flex;
        flex-direction: column;
        gap: var(--size-xxs);
    }

    .label {
        font: inherit;
        color: var(--color-fg-low);
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--gap-icon);
        color: var(--color-fg-low);
        width: 100%;
        line-height: 1.25;
        font: inherit;
        padding: var(--padding-y-icon) var(--size-md);
        background-color: var(--color-bg-subtle);
        box-shadow: inset 0 0 0 1px var(--color-border);
        border-radius: var(--corner-radius);
    }

    .text-input-icon {
        display: inline-flex;
        align-items: center;
        pointer-events: none;
        color: var(--color-border-subtle);
    }

    .input-wrapper input {
        all: unset;
        width: 100%;
    }

    .required-star {
        color: var(--color-danger);
    }

    .text-input-has-icon .input-wrapper {
        padding-left: var(--padding-x-icon);
        padding-right: var(--size-sm);
    }

    .input-wrapper input::placeholder {
        color: var(--color-border);
    }

    /* Browser focus handling */
    .input-wrapper:has(input:focus-visible):not(:has(input:disabled)) {
        box-shadow: inset 0 0 0 1px var(--color-border-focus);
    }

    .input-wrapper:has(input:focus-visible):not(:has(input:disabled)) .text-input-icon {
        color: var(--color-border-focus);
    }

    .input-wrapper:has(input:disabled) {
        --base-color: var(--color-neutral);
        cursor: not-allowed;
        box-shadow: inset 0 0 0 1px var(--color-border-subtle);
        opacity: 0.7;
    }

    /* Cleans up the native datalist arrow on some browsers to match your subtle style */
    input::-webkit-calendar-picker-indicator {
        color: var(--color-border-subtle);
        cursor: pointer;
    }
</style>
