<script lang="ts">
  import { ethers } from "ethers";
  import Web3Modal from "web3modal";
  import { networks, providerOptions } from "../../constants";
  import { defaultEvmStores, signerAddress } from "svelte-ethers-store";
  import User from "$components/User.svelte";
  import { selectedNetwork } from "$src/stores";
  import selectNetwork from "./selectNetwork.svelte";
  import { getContext } from "svelte";
  import IconLibrary from "$components/IconLibrary.svelte";
  import { onMount } from "svelte";

  const { open } = getContext("simple-modal");

  export let page: boolean = false;

  let providers,
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
      defaultEvmStores.setProvider(provider); 

      const network = await provider.getNetwork();

      // library = provider;
      // networkName = network.name;

      networks.forEach((element) => {
        if (parseInt(element.config.chainId) === network.chainId) {
          networkName = element.config.chainName;
          $selectedNetwork = element;
        }
      });
    }

  const connectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      const webProvider = await web3Modal.connect();
      const webLibrary = new ethers.providers.Web3Provider(webProvider);
      defaultEvmStores.setProvider(webProvider);
      const network = await webLibrary.getNetwork();

      library = webLibrary;
      // networkName = network.name;

      networks.forEach((element) => {
        if (parseInt(element.config.chainId) === network.chainId) {
          networkName = element.config.chainName;
          $selectedNetwork = element;
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const onNetworkChange = (text) => {
    networkName = text;
    changedName = true;
  };
</script>

<div class="flex items-center gap-y-4 gap-x-8">
  {#if $signerAddress}
  <button
      class="rounded-md border-none px-4 py-2 gap-x-1 text-black font-semibold"
      on:click={() => open(selectNetwork, { onNetworkChange, library })}
      >{networkName}<IconLibrary icon="down-open-arrow"/></button
    >
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
          class="rounded-full bg-indigo-900 border-none px-14 py-3 text-white"
          on:click={connectWallet}>Connect Wallet</button
        >
      </div>
    {:else}
      <button
        class="rounded-md border-none px-4 py-2 text-black"
        on:click={connectWallet}>Connect Wallet</button
      >
    {/if}
  {/if}
</div>
