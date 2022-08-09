<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import MintDialog from "$routes/mint/MintDialog.svelte";
  import { connected, defaultEvmStores } from "svelte-ethers-store";
  import { contractAddress, currencyInfo } from "./mint";
  import TokenPreview from "$routes/mint/TokenPreview.svelte";
  import { CONTRACTADDRESS, PROVIDER } from "$src/constants";

  export let params: {
    wild: string;
  };

  $: $contractAddress = params.wild || CONTRACTADDRESS;
  defaultEvmStores.setProvider(PROVIDER, null);
</script>

<div class="mx-auto flex flex-col items-center px-2 pt-24 md:pt-24">
  <span
    in:fade={{ duration: 2000 }}
    class="mb-7 text-center font-heading text-5xl text-white md:mb-14 md:text-7xl"
    >Welcome to the Feelerhead Faucet</span
  >
  <div
    class="items-stretch rounded-lg bg-black bg-opacity-30 filter backdrop-blur-sm"
    in:fly={{ y: 30, duration: 2000 }}
  >
    {#if $connected && $currencyInfo}
      <MintDialog />
    {:else}
      <TokenPreview />
    {/if}
  </div>
  <div
    class="my-6 text-center text-2xl md:mt-12"
    in:fly={{ y: 30, duration: 2000 }}
  >
    Feelerhead is a project about a new generation of emojis. A Feelerhead
    doesn't talk... it sees, EVERYTHING...
  </div>
</div>
