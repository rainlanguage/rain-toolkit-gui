<script lang="ts">
  import { ethers, Wallet } from "ethers";
  import Web3Modal from "web3modal";
  import { networks, providerOptions } from "../../constants";
  import { defaultEvmStores, signerAddress } from "svelte-ethers-store";
  import User from "$components/User.svelte";
  import { selectedNetwork } from "$src/stores";
  import selectNetwork from "./selectNetwork.svelte";
  import { getContext } from "svelte";
  import { get } from "svelte/store";

  const { open } = getContext("simple-modal");

  let networkName,
    changedName = false;

  export let isSigner: boolean | undefined = undefined;

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
  });

  const connectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      const webProvider = await web3Modal.connect();
      const webLibrary = new ethers.providers.Web3Provider(webProvider);
      defaultEvmStores.setProvider(webProvider);
      const network = await webLibrary.getNetwork();

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

  if (!isSigner && isSigner != undefined) {
    connectWallet();
  }
</script>

<div class=" flex items-center gap-y-4">
  {#if $signerAddress}
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
        <User address={$signerAddress} name={null} avatar={null} />
      </span>
    {/if}

    <button
      class="rounded-md border-none bg-gray-700 px-4 py-2 text-gray-200"
      on:click={() => open(selectNetwork, { onNetworkChange })}
      >Change Network</button
    >
  {:else if isSigner || isSigner == undefined}<button
      class="rounded-md border-none bg-gray-700 px-4 py-2 text-gray-200"
      on:click={connectWallet}>Connect Wallet</button
    >
  {/if}
</div>

<style>
  :global(.uYscM) {
    z-index: 20 !important;
  }
</style>
