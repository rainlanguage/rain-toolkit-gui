<script>
  import { getContext } from "svelte";
  import WalletConnect from "$components/wallet-connect/WalletConnect.svelte";

  import { signerAddress } from "svelte-ethers-store";
    import CustomSelect from "$components/CustomSelect.svelte";
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
    <span class="font-lobster text-4xl pl-16 cursor-pointer">Sloshy</span>
  </div> 
  {#if $signerAddress}
    <div class="flex direction flex-row items-center pr-14 gap-x-14">
      <div class="font-semibold"><a href="/#/sloshes">Sloshes</a></div>
      <div class="font-semibold"><a href="/#/">How this works</a></div>
      <WalletConnect />
      <!-- <CustomSelect options={networks} on:select={handleNetworkSelect}
              label={$activeNetwork?.displayName || 'Available networks'} className={'meinMenu'}
              dropDownClass={'nav-dropdown'}>
        <span slot="icon" class="select-icon"><img src={icons[$activeNetwork?.icon]}
                                                   alt={$activeNetwork?.displayName}/></span>
      </CustomSelect>
      <CustomSelect className={'meinMenu'} options={accountMenuOptions}
              label={$account.replace(/(.{6}).*(.{4})/, "$1…$2")}
              staticLabel={true} dropDownClass={'nav-dropdown'}>
      </CustomSelect> -->
    </div>
  {:else}
    <div />
  {/if}
</div>
</div>
<style>
  @media (max-width: 500px) { 
    .direction{
      flex-direction: column;
    }
  }
</style>