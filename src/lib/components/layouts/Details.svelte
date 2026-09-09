<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { ChevronDown } from '@lucide/svelte';
    import Frame from '../Frame.svelte';
    import Flex from './Flex.svelte';

    type Props = HTMLAttributes<HTMLElement> & {
        summary?: string;
        transparent?: boolean;
        shadow?: boolean;
        border?: boolean;
        isUnfolded?: boolean;
    }

    let {
        summary = '',
        transparent = false,
        shadow = false,
        border = false,
        isUnfolded = $bindable(false),
        children,
        ...rest
    }: Props = $props();

    const arrowSize = "1.1em";
    const styles = $derived(
        [rest.style, 'padding: 0;'].filter(Boolean).join(' ')
    );
</script>

<Frame 
    {transparent}
    {shadow}
    {border}
    style={styles}
>
    <details open={isUnfolded} >
        <summary class="details-header">
            <Flex gap="sm" align="center">
                <ChevronDown size={arrowSize} class="arrow" />
                <p>{summary}</p>
            </Flex>
        </summary>
        <div class="content">
            <hr noshade/>
            {@render children?.()}
        </div>
    </details>
</Frame>

<style>
    .content {
        padding: 0 var(--size-lg) var(--size-md) var(--size-lg);
    }

    .details-header {
        padding: var(--size-md) var(--size-lg);
    }

    :global(details .arrow) {
        transition: transform 0.15s ease;
    }

    :global(details[open] .arrow) {
        transform: rotate(180deg);
    }

    hr {
        margin: 0 var(--size-xxs) var(--size-md) var(--size-xxs);
        color: var(--color-fg-high);
        border-color: var(--color-border);
        background-color: var(--color-fg-high);
        border-bottom: 0;
    }

</style>

