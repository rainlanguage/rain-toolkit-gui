<script lang="ts">
  import { fade } from "svelte/transition";
  import Button from "$components/Button.svelte";
  import type {
    CreateSteps,
    Vapour721AConfig,
  } from "$routes/vapour721a/vapour721a-types";

  import { onMount } from "svelte";
  import { prepare } from "$routes/vapour721a/vapour721a";
  import { writable } from "svelte/store";
  import { generateMetadata, pin } from "$routes/vapour721a/uploadToIPFS";

  export let step: CreateSteps, config: Vapour721AConfig;
  const progress = writable(0);
  let uploadComplete, error;

  $: console.log($progress, uploadComplete, error);

  onMount(() => {
    window.scrollTo(0, 0);
  });

  const deploy721A = async () => {
    uploadComplete = false;
    $progress = 0;
    const metadatas = generateMetadata(config);
    let mediaUploadResp;
    // try {
    mediaUploadResp = await pin(metadatas, progress);
    console.log(mediaUploadResp);
    if (mediaUploadResp?.name == "AxiosError") {
      error = "whoops... try again 😭";
      return;
    } else {
      uploadComplete = true;
    }
    // }
    // catch {
    //   error = "whoops... try again 😭";
    //   return;
    // }
    config.baseURI = `ipfs://${mediaUploadResp.IpfsHash}`;
    const args = prepare(config);
    console.log(args);
  };
</script>

<div in:fade>
  <Button
    on:click={() => {
      step--;
    }}>Back</Button
  >
  <pre>
    {JSON.stringify(
      { ...config, currencyContract: null, erc20info: null },
      null,
      2
    )}
  </pre>
  <Button on:click={deploy721A}>Back</Button>
</div>
