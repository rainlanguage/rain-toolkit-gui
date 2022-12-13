<script lang="ts">
  import { ethers } from "ethers";
  import Web3Modal from "web3modal";
  import { networks, providerOptions } from "../../constants";
  import { defaultEvmStores, signerAddress } from "svelte-ethers-store";
  import User from "$components/User.svelte";
  import { selectedNetwork } from "$src/stores";
  import { getContext } from "svelte";
  import IconLibrary from "$components/IconLibrary.svelte";
  import { onMount } from "svelte";
  import Select from "$components/Select.svelte";
    import CustomSelect from "$components/CustomSelect.svelte";
    import FlashTooltip from "$components/FlashTooltip.svelte";
    import { push } from "svelte-spa-router";

  const { open } = getContext("simple-modal");

  export let page: boolean = false;

  let providers,
    tempExplorer = $selectedNetwork.blockExplorer,
    blockExplorer = $selectedNetwork.blockExplorer,
    library,
    networkName,
    changedName = false;

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
  }); 

  onMount(() => {
     
    onMountLoad()
    }) 

    const onMountLoad = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const webLibrary = new ethers.providers.Web3Provider(webProvider);
      defaultEvmStores.setProvider(provider); 

      const network = await provider.getNetwork();

      library = provider;
      // networkName = network.name;

      networks.forEach((element) => {
        if (parseInt(element.config.chainId) === network.chainId) {
          networkName = element.config.chainName;
          $selectedNetwork = element;
        }
      });
      blockExplorer = $selectedNetwork.blockExplorer
    }

  // const connectWallet = async () => {
  //   try {
  //     await web3Modal.clearCachedProvider();
  //     const webProvider = await web3Modal.connect();
  //     const webLibrary = new ethers.providers.Web3Provider(webProvider);
  //     defaultEvmStores.setProvider(webProvider);
  //     const network = await webLibrary.getNetwork();

  //     library = webLibrary;
  //     // networkName = network.name;

  //     networks.forEach((element) => {
  //       if (parseInt(element.config.chainId) === network.chainId) {
  //         networkName = element.config.chainName;
  //         oldNetName = element.config.chainName;
  //         $selectedNetwork = element;
  //       }
  //     });
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // };
  // const onNetworkChange = (text) => {
  //   networkName = text;
  //   changedName = true;
  // };

  const switchNetwork = async (event) => {
    let network = event.detail.selected
    
    try {
      // await window.ethereum.request({
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.config.chainId }],
      });
      defaultEvmStores.setProvider();
      
      networkName = network.config.chainName;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {

        try {
          // await window.ethereum.request({
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [network.config],
          });
          defaultEvmStores.setProvider();
          // name = network.config.chainName;
          networkName = network.config.chainName;
          blockExplorer = network.blockExplorer
        } catch (addError) {
        }
      }
      if (switchError.code === 4001) {
        defaultEvmStores.disconnect();
        location.reload();

      }
    }
  };




  let accountMenuOptions = [
    {
          id: "copy",
          label: "Copy Address",
          action: () => {
              if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                  // this.showTooltip = true;
                  // setTimeout(() => {
                  //     this.showTooltip = false;
                  // }, 1000);
                  return navigator.clipboard.writeText($signerAddress);
              }
              return Promise.reject("The Clipboard API is not available.");
          }
    },
    {
            id: "view",
            label: "View on Explorer",
            action: () => {
              console.log("temp", tempExplorer, blockExplorer);
              
              if(tempExplorer != blockExplorer){
                tempExplorer = blockExplorer;
                window.open(`${blockExplorer}address/${$signerAddress}`);
              }
            },
    }
  ]
</script>

<div class="flex items-center gap-y-4">
  <!-- {#if $signerAddress}
    <Select
      bind:value={$selectedNetwork}
      items={networks}
      on:change={() => switchNetwork($selectedNetwork)}
    />
    {#if changedName}
      <span
        class="align-center ease mr-2 flex w-max cursor-pointer rounded-full bg-gray-200 px-4 py-2 text-sm font-bold text-gray-500 transition duration-300 active:bg-gray-300"
      >
        <User
          address={$signerAddress}
          name={null}
          avatar={null}
          network={networkName}
        />
      </span>
    {:else}
      <span
        class="mr-2 px-4 py-2 rounded-full text-gray-600 bg-gray-200 font-bold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
      >
        <User
          address={$signerAddress}
          name={null}
          avatar={null}
          network={networkName}
        />
      </span>
    {/if}
    
  {:else}
    {#if page}
      <div class="mt-4">
        <button
          class="rounded-full border-none px-14 py-3 text-white"
          style="background-color: #2C2C54;"
          on:click={connectWallet}>Connect Wallet</button
        >
      </div>
    {:else}
      <button
        class="rounded-md border-none px-4 py-2 text-black font-semibold"
        on:click={connectWallet}>Connect Wallet</button
      >
    {/if}
  {/if} -->
<!-- {() => switchNetwork($selectedNetwork)} -->
    <!-- {#if $signerAddress} -->
      <CustomSelect options={networks} on:change={switchNetwork} 
              label={networkName || 'Available networks'} className={'meinMenu'}
              dropDownClass={'nav-dropdown'}>
        <span slot="icon" class="select-icon"><img src={$selectedNetwork?.config?.icon}
                                                   alt={networkName}/></span>
      </CustomSelect>
      
      <CustomSelect className={'meinMenu'} options={accountMenuOptions}
              label={$signerAddress?.replace(/(.{6}).*(.{4})/, "$1…$2")}
              staticLabel={true} dropDownClass={'nav-dropdown'}>
      </CustomSelect>
    <!-- {:else}
      {#if page}
        <div class="mt-4">
          <button
            class="rounded-full border-none px-14 py-3 text-white"
            style="background-color: #2C2C54;"
            on:click={connectWallet}>Connect Wallet</button
          >
        </div>
      {/if}
    {/if} -->
</div>

