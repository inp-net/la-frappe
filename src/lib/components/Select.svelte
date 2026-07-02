<script lang="ts">
    import type { Icon } from "@lucide/svelte";
    import type {
        HTMLSelectAttributes,
        HTMLInputAttributes,
    } from "svelte/elements";
    import { ChevronDown } from "@lucide/svelte";

    // Combine attributes to accommodate either a select or an input element safely
    type Props = (HTMLSelectAttributes & HTMLInputAttributes) & {
        options: string[];
        icon?: typeof Icon;
        value: string;
        placeholder?: string;
        disabled?: boolean;
        id?: string;
        type?: "select" | "datalist";
    };

    let {
        options = [],
        value = $bindable(),
        icon,
        children,
        placeholder,
        disabled = false,
        type = "select",
        id,
        class: className,
        ...rest
    }: Props = $props();

    const datalistId = $derived(id);

    const classes = $derived(
        ["text-input", icon && "text-input-has-icon", className]
            .filter(Boolean)
            .join(" "),
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

        {#if type === "datalist"}
            <input
                type="text"
                bind:value
                {disabled}
                {placeholder}
                list={datalistId}
                {...rest}
            />
            <datalist id={datalistId}>
                {#each options as option}
                    <option value={option}>{option}</option>
                {/each}
            </datalist>
        {:else}
            <select bind:value {disabled} {...rest}>
                {#if placeholder}
                    <option value="" disabled selected>{placeholder}</option>
                {/if}
                {#each options as option}
                    <option value={option}>{option}</option>
                {/each}
            </select>

            <ChevronDown size="1em" class="select-chevron" />
        {/if}
    </div>
</label>

<style>
    .text-input {
        display: inline-flex;
        flex-direction: column;
        gap: var(--size-xxs);
        width: 100%;
    }

    .label {
        font: inherit;
        width: 100%;
    }

    @media (min-width: 768px) {
        .text-input {
            width: 25%;
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
        transition:
            opacity 0.2s ease,
            box-shadow 0.2s ease;
    }

    .text-input-icon {
        display: inline-flex;
        align-items: center;
        pointer-events: none;
        color: var(--color-border-subtle);
    }

    :global(.input-wrapper .select-chevron) {
        position: absolute;
        right: 1em;
        pointer-events: none;
    }

    .input-wrapper select,
    .input-wrapper input {
        flex-grow: 1;
        appearance: none;
        background: transparent;
        border: none;
        font: inherit;
        color: inherit;
        outline: none;
        cursor: pointer;
        width: 100%;
    }

    .input-wrapper input {
        cursor: text;
    }

    .text-input-has-icon .input-wrapper {
        padding-left: var(--padding-x-icon);
    }

    .input-wrapper:has(select:focus-visible, input:focus-visible):not(
            [data-disabled="true"]
        ) {
        box-shadow: inset 0 0 0 1px var(--color-border-focus);
    }

    .input-wrapper[data-disabled="true"] {
        --base-color: var(--color-neutral);
        cursor: not-allowed;
        box-shadow: inset 0 0 0 1px var(--color-border-subtle);
        background-color: var(--color-bg);
    }

    .input-wrapper[data-disabled="true"] select,
    .input-wrapper[data-disabled="true"] input {
        cursor: not-allowed;
        color: var(--color-border-subtle);
    }

    .required-star {
        color: var(--color-danger);
    }

    .input-wrapper select:focus-visible,
    .input-wrapper input:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 4px;
    }
</style>

