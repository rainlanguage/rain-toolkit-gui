<script lang="ts">
  import { fade } from "svelte/transition";
  import { signerAddress } from "svelte-ethers-store";
  import { deployer } from "./browse";
  import Button from "$components/Button.svelte";
  import TokenPreview from "$components/nft/TokenPreview.svelte";
  import Switch from "$components/Switch.svelte";
  import type { NFTData } from "$src/types";
  import { push } from "svelte-spa-router";
  import { getMetadata, listVapour721As } from "./browse";
  import IconLibrary from "$components/IconLibrary.svelte";

  $: console.log($listVapour721As);
  let checked;
  $: $deployer = checked ? $signerAddress : null;

  $: dataPromises = $listVapour721As.map(async (vapour): Promise<NFTData> => {
    const metadata = await getMetadata(vapour.baseURI);
    return {
      address: vapour.id,
      name: vapour.name,
      description: metadata.description,
      totalSupply: vapour.supplyLimit,
      imageSrc: metadata.image,
    };
  });
</script>

<div
  class="flex flex-row items-center justify-between gap-x-3 mb-8 text-sm text-gray-300"
>
  <span in:fade={{ duration: 2000 }} class="font-heading text-6xl text-white"
    >Vapour721A marketplace</span
  >
  <div class="flex flex-row gap-x-4 items-center">
    <span>Show only contracts I've deployed </span><Switch bind:checked />
    <span
      on:click={listVapour721As.refresh}
      class="bg-gray-700 py-2 px-3 rounded-full flex flex-row gap-x-2 hover:bg-gray-600 transition-colors cursor-pointer"
    >
      Refresh
      <span class="flex flex-col justify-center"
        ><IconLibrary icon="reload" /></span
      >
    </span>
  </div>
</div>
<div class="grid grid-cols-4 gap-4">
  {#if dataPromises.length}
    {#each dataPromises as promise}
      {#await promise then data}
        <TokenPreview {data}>
          <Button
            on:click={() => {
              push(`/vapour721a/mint/${data.address}`);
            }}>Mint</Button
          >
        </TokenPreview>
      {/await}
    {/each}
  {/if}
</div>
