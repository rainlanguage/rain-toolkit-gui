<script lang="ts">
  import { fade } from "svelte/transition";
  import _ from "lodash";
  import type { NFTData } from "$src/types";

  export let data: NFTData;
  $: show = true;
  // Object.values(_.omit(data, "tokenId")).every((v) => !!v);
</script>

<!-- <span class="text-2xl">Next token...</span> -->
<div
  class="flex flex-col gap-y-4 max-w-sm border border-gray-600 p-2 rounded-2xl"
>
  <div class="rounded-lg overflow-hidden flex-grow">
    {#if show}
      <img alt="the next feelerhead" in:fade src={data.imageSrc} />
    {:else}
      <div class="opacity-30">
        <img
          alt="loading the next feelerhead"
          class="animate-pulse"
          src="/images/unknown.png"
        />
      </div>
    {/if}
  </div>
  {#if show}
    <div class="flex flex-col">
      <span in:fade class="text-xl">{data.name}</span>
      <span in:fade class="text-gray-400">{data.description}</span>
    </div>
  {:else}
    <span class="text-2xl opacity-0">name</span>
  {/if}
  <div class="grid grid-cols-2 bg-gray-800 rounded-lg p-2">
    <div class="flex flex-col gap-y-1">
      {#if data}
        {#if data.tokenId}
          <span class=" text-gray-400">Next token</span>
          <span in:fade>{data.tokenId} / {data.totalSupply}</span>
        {:else}
          <span class=" text-gray-400">Total supply</span>
          <span in:fade>{data.totalSupply}</span>
        {/if}
      {:else}
        <span class="animate-pulse animate-bounce">...</span>
      {/if}
    </div>
  </div>
  <slot />
</div>
