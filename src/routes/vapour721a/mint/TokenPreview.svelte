<script lang="ts">
  import { fade } from "svelte/transition";
  import { contractInfo } from "./mint";
  import { nextTokenMetadata, singleQuote } from "$routes/mint/feelerhead-mint";
  import Connect from "$lib/Connect.svelte";
  import { defaultEvmStores } from "svelte-ethers-store";
  import { PROVIDER } from "$src/constants";
  import { onDestroy, onMount } from "svelte";

  defaultEvmStores.setProvider(PROVIDER, null);

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

<!-- <button on:click={contractInfo.refresh}>tick</button> -->
<div
  class="flex max-w-5xl flex-col-reverse gap-y-6 p-7 md:grid md:grid-cols-2 md:gap-y-0 md:gap-x-7 md:p-10"
>
  <div class="flex flex-col justify-between gap-y-6 md:gap-y-0">
    <div class="flex flex-col gap-y-8 md:mb-6">
      <div>
        <span class="font-heading text-7xl">Feelerhead</span>
        <span class="font-heading text-3xl">WELCOMES...</span>
      </div>
      {#if show}
        <span in:fade class="text-4xl">{$nextTokenMetadata.name}</span>
      {:else}
        <span class="text-4xl opacity-0">name</span>
      {/if}
      <div class="grid grid-cols-2 text-3xl">
        <div class="flex flex-col gap-y-2">
          <span class="statHeading">MINT PRICE</span>
          {#if show}
            <span in:fade>{$singleQuote} ETH</span>
          {:else}
            <span class="animate-pulse animate-bounce">...</span>
          {/if}
        </div>
        <div class="flex flex-col gap-y-2">
          <span class="statHeading">TOKEN</span>
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
    <Connect />
  </div>
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

<style>
  .statHeading {
    @apply font-heading;
  }
</style>
