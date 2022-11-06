<script lang="ts">
    import Button from '$components/Button.svelte';
    import IconLibrary from '$components/IconLibrary.svelte';
    import Select from '$components/Select.svelte';
    import Input from 'rain-svelte-components/package/Input.svelte'
    import { getContext } from "svelte";
    import SelectToken from './SelectToken.svelte';

    let networkName = "ethereum"
    const { open } = getContext("simple-modal");
</script>
<div class="flex flex-col items-center justify-start py-14 ht">
    <div class="py-6">
        <span>Swap</span>
        <span>Trust</span>
    </div>
    <div class="flex flex-col items-center bg-white gap-y-4 p-4 rounded-lg">
        <span>Swap</span>
        <div class="flex flex-col items-stretch bg-gray-300 border border-orange-400 rounded-lg">
            <div class="flex items-center justify-between gap-x-14 border-b p-4 border-orange-400">
                <Input type="text" bind:value={networkName} />
                <span class="gap-x-4" on:click={() =>{ open(SelectToken)}}>{networkName.toUpperCase()}<IconLibrary icon="down-open-arrow"/></span>
            </div>
            <div class="flex items-center justify-between gap-x-14 p-4">
                <Input type="text" bind:value={networkName} />
                <span>Select token</span>
            </div>
        </div>
        <!-- <span class="flex w-full"> -->
            <!-- <Button variant="bg-orange-300">Ok</Button> -->
            <button class="bg-orange-400 w-full rounded-full text-base leading-none py-3 px-5 text-white" >Ok</button>
        <!-- </span> -->
    </div>
    <!-- <Input /> -->
</div>

<style>
    .ht{
        height: 80vh;
    }
</style>