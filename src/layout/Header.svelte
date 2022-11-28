<script>
  import { getContext } from "svelte";
  import WalletConnect from "$components/wallet-connect/WalletConnect.svelte";

  const { open } = getContext("simple-modal");

  const handleConnect = () => {
    // open(Connect);
  };
</script>

<!-- <div
  class="sticky top-0 z-40 flex h-16 w-full flex-row items-center justify-between px-5"
> -->
<div
  class="top-0 z-30 flex h-24 w-full flex-row items-end  justify-end px-5"
> 
<div class="container flex flex-wrap justify-between items-center mx-auto">
  
  <div >
    <!-- <img src="./assets/Sloshy.png" alt="Slosh Logo" /> -->
    <span class="font-lobster text-4xl pl-16">Sloshy</span>
  </div> 
  <div class="flex direction flex-row items-center pr-14 gap-x-14">
    <div class="font-semibold">Trust Vaults</div>
    <div class="font-semibold">How this works</div>
    <WalletConnect />
  </div>
</div>
</div>
<style>
  @media (max-width: 500px) { 
    .direction{
      flex-direction: column;
    }
  }
</style>