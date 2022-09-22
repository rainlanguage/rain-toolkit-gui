<script lang="ts">
import { onDestroy, onMount } from "svelte";

export let autocompleteSelection: Selection, OpMeta
const parentElement = autocompleteSelection.anchorNode.parentElement
const selection = autocompleteSelection

let active = 0
let popup
let initialScroll = window.scrollY
let liveScroll

$: text = parentElement.textContent
$: position = parentElement.getBoundingClientRect()

$: results = Array.from(OpMeta).filter(entry => entry[1].name.startsWith(text))

const select = (i) => {
    const selection = window.getSelection();
    parentElement.innerHTML = results[i][1].name
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(parentElement);
    range.collapse(false);
    autocompleteSelection.addRange(range);
    parentElement.focus();
    autocompleteSelection = null
}

const onKeyDown = (e) => {
    if (e.key == "ArrowUp") {
        e.preventDefault()
        if (active > 0) active--
    }
    if (e.key == "ArrowDown") {
        e.preventDefault()
        if (active < results.length - 1) active++
    }
    if (e.key == "Enter") {
        e.preventDefault()
        select(active)
    }
}

onMount(()=>{
		document.body.appendChild(popup)
        document.addEventListener('keydown', onKeyDown)
	})

onDestroy(()=>{
    document.removeEventListener('keydown', onKeyDown)
})
</script>

<div bind:this={popup} class="fixed bg-gray-800 border border-gray-600 text-sm text-gray-200 rounded-sm z-20" style={`top: ${position.bottom + initialScroll - liveScroll}px; left: ${position.right}px`}>
{#each results as result, i}
<div 
    on:click={()=>{select(i)}} class:inactive={i !== active} class:active={i == active}
    class="p-1 cursor-pointer"
    >
    {result[1].name}
</div>
{/each}
</div>

<svelte:window bind:scrollY={liveScroll} />

<style lang="postcss">
    .active {
        @apply bg-blue-500
    }

    .inactive {
        @apply bg-gray-800 hover:bg-gray-700
    }
</style>