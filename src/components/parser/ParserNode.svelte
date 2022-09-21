<script lang="ts">
export let parsed, string: string
$: hasParameters = parsed?.parameters?.length
const randomColor = `hsl(${Math.floor(Math.random()*360)}, 50%, 50%`;
$: console.log('in parser node', parsed)
$: startString = parsed?.parameters ? 
string.substring(parsed.position[0], parsed?.parameters[0].position[0]) 
: string.substring(parsed.position[0], parsed.position[1] + 2)
$: endString = parsed?.parameters ? 
string.substring(parsed?.parameters[parsed?.parameters.length - 1].position[1] + 1, parsed.position[1] + 1) 
: ""

$: console.log(startString, endString)
// $: console.log(parsed?.parameters, startString, string, parsed.position[0] -1, parsed.position[1] + 1)
</script>

<span style={`color:${randomColor}`} class="inline-flex">
<span class="inline-flex">{startString}</span>
    {#if hasParameters}
        {#each parsed?.parameters as parameter, i}
            <svelte:self parsed={parameter} {string} />
        {/each}
    <span class="inline-flex">{endString}</span>
    {/if}
</span>
    
