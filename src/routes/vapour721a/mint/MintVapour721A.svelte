<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { connected, defaultEvmStores } from "svelte-ethers-store";
  import { contractAddress, currencyInfo } from "./mint";
  import TokenPreview from "$routes/vapour721a/mint/TokenPreview.svelte";
  import MintDialog from "$routes/vapour721a/mint/MintDialog.svelte";

  export let params: {
    wild: string;
  };

  $: $contractAddress = params.wild;
  // defaultEvmStores.setProvider(PROVIDER, null);
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
    </div>
    <div class="col-span-3">
      <TokenPreview />
    </div>
  {/if}
</div>
