<script lang="ts">
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

  export let step: CreateSteps, config: Vapour721AConfig;
  let uploadComplete: boolean,
    error: string,
    args: InitializeConfigStruct,
    deployPromise: Promise<Contract>;

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
    const factory = new ethers.Contract(
      "0xeC33aA18e88136C162aEeE30b13530D78B2076c4",
      VapourFactoryArtifact.abi,
      $signer
    );
    const tx = await factory.createChildTyped(args);
    const receipt = await tx.wait();
    const address = getNewChildFromReceipt(receipt, factory);
    return new ethers.Contract(address, VapourArtifact.abi, $signer);
  };
</script>

<div in:fade>
  <Button
    on:click={() => {
      step--;
    }}>Back</Button
  >
  <Button
    disabled={!uploadComplete}
    on:click={() => {
      deployPromise = deploy721A();
    }}>Deploy</Button
  >
  {#if deployPromise}
    <ContractDeploy {deployPromise} type="Vapour721A" />
  {/if}

  <pre>
    {JSON.stringify(
      { ...config, currencyContract: null, erc20info: null },
      null,
      2
    )}
  </pre>
  {#if args}
    <HumanReadableVapour vmStateConfig={args.vmStateConfig} />
  {/if}
</div>
