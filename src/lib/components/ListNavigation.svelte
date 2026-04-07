<script lang="ts">

    interface ListString {
        folderNames: string[];
    }

    let {
        folderNames
    } : ListString = $props();

    import {
        House
    } from '@lucide/svelte';

</script>

<div class="horizontal">
    <House></House>
    {#each folderNames as folder : string, index}
        <a id="folder-button">{folder}</a>
        {#if index < (folderNames.length-1)}
            <p>/</p>
        {/if}
    {/each}
</div>

<style>

    .horizontal {
        display: flex;
        align-items: center;
        gap: 2em;
    }

    #folder-button {
        font-weight: bold;
    }
    
</style>