<script lang="ts">
import ParserNode from './ParserNode.svelte';
import { Parser, type StateConfig} from 'rain-sdk'
let parserInput, parsed, string
export let vmStateConfig: StateConfig

const placeholderText = "Write your expression"
const inputAction = (node: HTMLDivElement) => {
    const updateTree = () => {
        string = node.innerHTML
        parsed = Parser.getParseTree(string)
        vmStateConfig = Parser.getStateConfig(string)
        console.log(parsed)
    }

    const focusInput = () => {
        if (node.innerHTML ==  placeholderText) node.innerHTML = ""
    }

    node.addEventListener('input', updateTree)
    node.addEventListener('focus', focusInput)

}
$: console.log(vmStateConfig)
</script>

<div class="border-2 rounded-lg border-gray-700 p-4 w-full" use:inputAction contenteditable="true" bind:this={parserInput}>
    {placeholderText}
</div>
{#if parsed?.[0].tree.length}
<ParserNode parsed={parsed[0].tree[0]} {string}/>
{/if}