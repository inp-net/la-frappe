<script lang="ts">
    import { Badge, Flex } from "azucar-ui";

    interface Props {
        readonly filters: readonly string[];
        activeIndexes?: number[];
        onFilterClick?: (index: number) => void;
    }

    let { 
        filters, 
        activeIndexes = $bindable([]), 
        onFilterClick 
    }: Props = $props();

    let isTousActive = $derived(activeIndexes.length === 0);

    let sortedFilters = $derived(
        [
            { name: "Tous", originalIndex: -1, isTous: true },
            ...filters.map((name, originalIndex) => ({ name, originalIndex, isTous: false }))
        ].sort((a, b) => {
            const aActive = a.isTous ? isTousActive : activeIndexes.includes(a.originalIndex);
            const bActive = b.isTous ? isTousActive : activeIndexes.includes(b.originalIndex);

            if (aActive !== bActive) {
                return aActive ? -1 : 1;
            }

            if (a.isTous) return 1;
            if (b.isTous) return -1;

            return a.originalIndex - b.originalIndex;
        })
    );

    /** Méthode qui gère le badge "Tous".
     * désactive tous les autres badges.
     * @param index : numéro d'index cliqué.
     */
    function handleInternalClick(index: number) {
        if (index === -1) {
            activeIndexes = [];
        } else {
            if (activeIndexes.includes(index)) {
                activeIndexes = activeIndexes.filter(i => i !== index);
            } else {
                activeIndexes = [...activeIndexes, index];
            }
        }
        onFilterClick?.(index);
    }
</script>

<div class="scrollable">
    <Flex gap="xs" wrap={false} style="min-width: max-content;">
        {#each sortedFilters as { name, originalIndex, isTous }}
            {@const isActive = isTous ? isTousActive : activeIndexes.includes(originalIndex)}
            
            <button
                type="button"
                class="unstyled filter-btn"
                onclick={() => handleInternalClick(originalIndex)}
            >
                {#if isActive}
                    <Badge>{name}</Badge>
                {:else}
                    <Badge variant="outline">{name}</Badge>
                {/if}
            </button>
        {/each}
    </Flex>
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
        width: 100%; 
        overflow-x: auto; 
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    }

    .scrollable::-webkit-scrollbar { 
        display: none; 
    }

    .filter-btn {
        flex-shrink: 0;
        display: inline-block;
        white-space: nowrap; /* Forces badges to stay perfectly side-by-side */
    }
</style>
