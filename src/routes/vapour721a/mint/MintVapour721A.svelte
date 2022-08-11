<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { connected, defaultEvmStores, contracts } from "svelte-ethers-store";
  import { contractAddress, contractInfo, currencyInfo } from "./mint";
  import MintDialog from "$routes/vapour721a/mint/MintDialog.svelte";
  import NextToken from "$routes/vapour721a/mint/NextToken.svelte";
  import HumanReadableVapour from "$routes/vapour721a/HumanReadableVapour.svelte";
  import { onMount } from "svelte";

  export let params: {
    wild: string;
  };

  $: $contractAddress = params.wild;

  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<span in:fade={{ duration: 2000 }} class="font-heading text-6xl text-white"
  >Mint from a Vapour721A</span
>
<div
  class="items-stretch w-full grid grid-cols-7 gap-x-24 mt-12"
  in:fly={{ y: 30, duration: 2000 }}
>
  {#if $connected && $currencyInfo}
    <div class="col-span-4">
      <MintDialog />
      {#if $contractInfo?.vmStateConfig}
        <div class="mt-8">
          <HumanReadableVapour vmStateConfig={$contractInfo.vmStateConfig} />
        </div>
      {/if}
    </div>
    <div class="col-span-3">
      <NextToken />
    </div>
  {/if}
</div>
