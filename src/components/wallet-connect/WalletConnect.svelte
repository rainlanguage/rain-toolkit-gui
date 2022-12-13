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
  import { img } from "$routes/assets";

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
    location.reload()
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
                window.open(`${$selectedNetwork.blockExplorer}address/${$signerAddress}`);
            },
    }
  ]
</script>

<div class="flex items-center gap-y-4">
  <CustomSelect options={networks} on:change={switchNetwork} 
          label={networkName || 'Available networks'} className={'meinMenu'}
          dropDownClass={'nav-dropdown'}>
    <span slot="icon" class="select-icon"><img src={img[$selectedNetwork?.config?.icon]}
                                               alt={networkName}/></span>
  </CustomSelect>
  
  <CustomSelect className={'meinMenu'} options={accountMenuOptions}
          label={$signerAddress?.replace(/(.{6}).*(.{4})/, "$1…$2")}
          staticLabel={true} dropDownClass={'nav-dropdown'}>
  </CustomSelect>
</div>

