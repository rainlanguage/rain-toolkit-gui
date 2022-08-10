<script lang="ts">
  import autoAnimate from "@formkit/auto-animate";
  import { signer } from "svelte-ethers-store";
  import { fade } from "svelte/transition";
  import Button from "$components/Button.svelte";
  import type {
    CreateSteps,
    InitializeConfigStruct,
    Vapour721AConfig,
  } from "$routes/vapour721a/vapour721a-types";
  import { onMount } from "svelte";
  import { prepare } from "$routes/vapour721a/vapour721a";
  import { writable } from "svelte/store";
  import { generateMetadata, pin } from "$routes/vapour721a/uploadToIPFS";
  import VapourFactoryArtifact from "$routes/vapour721a/abi/Vapour721AFactory.json";
  import VapourArtifact from "$routes/vapour721a/abi/Vapour721A.json";

  import { Contract, ethers } from "ethers";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  import { getNewChildFromReceipt } from "$src/utils";
  import HumanReadableVapour from "$routes/vapour721a/HumanReadableVapour.svelte";
  import IconLibrary from "$components/IconLibrary.svelte";
  import Ring from "$components/Ring.svelte";

  export let step: CreateSteps, config: Vapour721AConfig;
  let uploadComplete: boolean,
    error: string,
    args: InitializeConfigStruct,
    deployPromise: Promise<Contract>;
  let deploying;

  const progress = writable(0);

  onMount(async () => {
    window.scrollTo(0, 0);
    args = await prepareDeployArgs();
  });

  const prepareDeployArgs = async () => {
    uploadComplete = false;
    $progress = 0;
    const metadatas = generateMetadata(config);
    const mediaUploadResp = await pin(metadatas, progress);
    if (mediaUploadResp?.name == "AxiosError") {
      error = "whoops... try again 😭";
      return;
    } else {
      uploadComplete = true;
    }
    config.baseURI = `ipfs://${mediaUploadResp.IpfsHash}`;
    return prepare(config);
  };

  const deploy721A = async () => {
    deploying = true;
    const factory = new ethers.Contract(
      "0xeC33aA18e88136C162aEeE30b13530D78B2076c4",
      VapourFactoryArtifact.abi,
      $signer
    );
    let address;
    try {
      const tx = await factory.createChildTyped(args);
      const receipt = await tx.wait();
      address = getNewChildFromReceipt(receipt, factory);
    } catch {
      deploying = false;
    }
    deploying = false;
    return new ethers.Contract(address, VapourArtifact.abi, $signer);
  };
  $: console.log(deploying);
</script>

<div use:autoAnimate class="flex flex-col gap-y-8" in:fade>
  <div
    on:click={() => {
      step--;
    }}
    class="flex flex-row items-center gap-x-2 rounded-full py-2 px-4 bg-gray-800 self-start cursor-pointer hover:bg-gray-700 transition-colors"
  >
    <IconLibrary icon="back" width={15} />
    Back
  </div>
  <!-- <pre>
    {JSON.stringify(
      { ...config, currencyContract: null, erc20info: null },
      null,
      2
      )}
    </pre> -->
  <span class="text-3xl">Nearly there!</span>
  {#if args}
    <HumanReadableVapour vmStateConfig={args.vmStateConfig} />
    <Button
      classes="opacity-80 hover:opacity-100 transition-opacity cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-lg rounded-md py-3 text-center"
      disabled={!uploadComplete || deploying}
      on:click={() => {
        deployPromise = deploy721A();
      }}>Deploy</Button
    >
  {:else}
    <div class="flex flex-rowg gap-x-4">
      <Ring color="#FFF" size="20px" />
      <span> Generating your Rain script and uploading metadata... </span>
    </div>
  {/if}
  {#if deployPromise}
    <ContractDeploy {deployPromise} type="Vapour721A" />
  {/if}
</div>
