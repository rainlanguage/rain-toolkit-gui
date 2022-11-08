<script lang="ts">
    import Button from '$components/Button.svelte';
    import IconLibrary from '$components/IconLibrary.svelte';
    import Input from 'rain-svelte-components/package/Input.svelte'
    import { getContext } from "svelte";
    import SelectToken from './SelectToken.svelte';

    let networkName = "ethereum"
    const { open } = getContext("simple-modal");
</script>
<div class="py-4">
    <div class="flex flex-col items-stretch bg-gray-300 border border-orange-400 rounded-lg m-4">
            <div id="first" class="flex items-center justify-between gap-x-14 border-b p-4 border-orange-400">
                <Input type="text" bind:value={networkName} />
                <span class="gap-x-4" on:click={() =>{ open(SelectToken)}}>{networkName.toUpperCase()}<IconLibrary icon="down-open-arrow"/></span>
            </div>
            <span class="absolute bg-white p-2 rounded-full"><IconLibrary width={18} icon="up-arrow"/></span>
            <div id="second" class="flex items-center justify-between gap-x-14 p-4">
                <Input type="text" bind:value={networkName} />
                <span>Select token</span>
            </div>
    </div>
    <div class="w-full px-4">
        <button class="bg-orange-400 w-full rounded-full text-base py-3 px-5 text-white ">Ok</button>
    </div>
    <!-- <button class="bg-orange-400 w-full rounded-full text-base leading-none py-3 px-5 text-white" >Ok</button> -->
</div>

<style>
    .ht{
        height: 62vh;
    }
</style>