<script lang="ts">
    import { Flex, Button } from 'azucar-ui';
    import { ArrowLeft, ArrowRight } from '@lucide/svelte';

    type Props = {
        page: number;
        maxPage: number;
    };

    let {
        page = $bindable(0),
        maxPage = 0,
    }: Props = $props();

    let maxPagePrint = $derived(maxPage + 1);

    function handleArrowClick(delta: number) {
        page = Math.min(Math.max(page + delta, 0), maxPage);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const val = parseInt(target.value, 10);
        if (!isNaN(val)) {
            page = Math.min(Math.max(val - 1, 0), maxPage);
        }
    }
</script>

<Flex align="center">
    <Button
        onclick={() => handleArrowClick(-1)}
        disabled={page === 0}
        icon={ArrowLeft}
    />
    <Flex gap="xs" align="center">
        <p>Page </p>
        <input 
            type="number" 
            min="1" 
            max={maxPagePrint} 
            value={page + 1}
            oninput={handleInput}
            class="page-input"
        />
        <p> / {maxPagePrint}</p>
    </Flex>
    <Button
        onclick={() => handleArrowClick(1)}
        disabled={page === maxPage}
        icon={ArrowRight}
    />
</Flex>

<style>
    .page-input {
        width: 50px;
        text-align: center;
        font-size: 1rem;
        border: none;
        outline: none;
        transition: border-color 0.2s;
        font-family: Atkinson Hyperlegible;
        color: var(--color-fg-high);
        background-color: transparent;
    }
</style>
