<script lang="ts">
    import { Badge } from "azucar-ui";
    import { flip } from "svelte/animate";

    interface Props {
        readonly filters: readonly string[];
        activeIndexes?: number[];
        onFilterClick?: (index: number) => void;
    }

    let {
        filters,
        activeIndexes = $bindable([]),
        onFilterClick,
    }: Props = $props();

    let isTousActive = $derived(activeIndexes.length === 0);

    let sortedFilters = $derived(
        [
            { id: "all", name: "Tous", originalIndex: -1, isTous: true },
            ...filters.map((name, originalIndex) => ({
                id: `filter-${originalIndex}`,
                name,
                originalIndex,
                isTous: false,
            })),
        ].sort((a, b) => {
            const aActive = a.isTous
                ? isTousActive
                : activeIndexes.includes(a.originalIndex);
            const bActive = b.isTous
                ? isTousActive
                : activeIndexes.includes(b.originalIndex);

            if (aActive !== bActive) {
                return aActive ? -1 : 1;
            }

            if (a.isTous) return 1;
            if (b.isTous) return -1;

            return a.originalIndex - b.originalIndex;
        }),
    );

    function handleInternalClick(index: number) {
        if (index === -1) {
            activeIndexes = [];
        } else {
            if (activeIndexes.includes(index)) {
                activeIndexes = activeIndexes.filter((i) => i !== index);
            } else {
                activeIndexes = [...activeIndexes, index];
            }
        }
        onFilterClick?.(index);
    }
</script>

<!--
    @component
    Composant qui affiche les options de filtrage horizontalement. Tout est par
    défaut. Si un ou plusieurs filtre sont cliqué, liste activeIndexes est mis
    à jour.
-->

<div class="scrollable flex-container">
    {#each sortedFilters as { id, name, originalIndex, isTous } (id)}
        {@const isActive = isTous
            ? isTousActive
            : activeIndexes.includes(originalIndex)}

        <button
            type="button"
            class="unstyled filter-btn"
            animate:flip={{ duration: 200 }}
            onclick={() => handleInternalClick(originalIndex)}
        >
            <Badge variant={isActive ? undefined : "outline"}>
                {name}
            </Badge>
        </button>
    {/each}
</div>

<style>
    .unstyled {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        color: inherit;
        cursor: pointer;
        text-align: inherit;
    }

    .scrollable {
        padding: var(--size-xxs) 0px;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    }

    .scrollable::-webkit-scrollbar {
        display: none;
    }

    .flex-container {
        display: flex;
        gap: 5px;
        flex-wrap: nowrap;
    }

    .filter-btn {
        flex-shrink: 0;
        display: inline-flex;
        will-change: transform;
    }
</style>

