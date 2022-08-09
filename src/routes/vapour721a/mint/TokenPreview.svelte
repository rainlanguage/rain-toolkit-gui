<script lang="ts">
  import { fade } from "svelte/transition";
  import { contractInfo } from "./mint";
  import { nextTokenMetadata, singleQuote } from "./feelerhead-mint";
  import Connect from "$components/Connect.svelte";
  import { defaultEvmStores } from "svelte-ethers-store";
  import { onDestroy, onMount } from "svelte";

  // defaultEvmStores.setProvider(PROVIDER, null);

  let interval;
  onMount(() => {
    interval = setInterval(() => {
      if (!$nextTokenMetadata?.image) {
        contractInfo.refresh();
      }
    }, 10 * 1000); // refresh every 10 seconds
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  $: show = $nextTokenMetadata && $singleQuote && $contractInfo;
</script>

<!-- <span class="text-2xl">Next token...</span> -->
<div
  class="flex flex-col gap-y-4 max-w-sm border border-gray-600 p-2 rounded-2xl"
>
  <div class="rounded-lg overflow-hidden">
    {#if show}
      <img alt="the next feelerhead" in:fade src={$nextTokenMetadata.image} />
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
      <span in:fade class="text-xl">{$nextTokenMetadata.name}</span>
      <span in:fade class="text-gray-400">{$nextTokenMetadata.description}</span
      >
    </div>
  {:else}
    <span class="text-2xl opacity-0">name</span>
  {/if}
  <div class="grid grid-cols-2 bg-gray-800 rounded-lg p-2">
    <!-- <div class="flex flex-col gap-y-2">
      <span class="text-sm text-gray-400">Mint price</span>
      {#if show}
        <span in:fade>{$singleQuote} ETH</span>
      {:else}
        <span class="animate-pulse animate-bounce">...</span>
      {/if}
    </div> -->
    <div class="flex flex-col gap-y-1">
      <span class=" text-gray-400">Next token</span>
      {#if show}
        <span in:fade
          >{+$contractInfo.noOfNfts + 1} / {$contractInfo.supplyLimit}</span
        >
      {:else}
        <span class="animate-pulse animate-bounce">...</span>
      {/if}
    </div>
  </div>
</div>
