<script lang="ts">
  import { fade } from "svelte/transition";
  import CircularProgressBar from "./CircularProgressBar.svelte";
  import { filedrop } from "filedrop-svelte";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  export let imageFile;
  export let upload;
  export let mediaUploadResp = null;

  let options = {};
  let image, uploadComplete, error;

  const progress = writable(0);
  $: progressPercent = `${Math.floor($progress * 100)}%`;

  onMount(() => {
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  });

  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      // convert image file to base64 string
      image.src = reader.result;
    },
    false
  );

  const readFile = async (files) => {
    uploadComplete = false;
    $progress = 0;
    reader.readAsDataURL(files.accepted[0]);
    imageFile = files.accepted[0];
    try {
      mediaUploadResp = await upload(imageFile, progress);
      if (mediaUploadResp?.name == "AxiosError") {
        error = "whoops... try again 😭";
      } else {
        uploadComplete = true;
      }
    } catch {
      error = "whoops... try again 😭";
    }
  };

  $: imageDropped = image?.src;
</script>

<div
  use:filedrop={options}
  on:filedrop={(e) => {
    readFile(e.detail.files);
  }}
  class="flex flex-col justify-center items-center aspect-square bg-gray-800 border-dashed border-gray-600 relative"
  class:border={!imageDropped}
>
  <img alt="Artwork preview" class:hidden={!imageDropped} bind:this={image} />

  {#if !imageDropped}
    <span>Drop your artwork here</span>
    <span class="underline text-gray-400">Pick a file</span>
  {/if}

  {#if $progress || error}
    <div
      in:fade
      class="absolute top-2 right-2 flex flex-row items-center gap-x-2 text-sm bg-black bg-opacity-70 p-3 rounded-full"
    >
      {#if uploadComplete}
        <span in:fade> Uploaded </span>
      {:else if error}
        <span in:fade>
          {error}
        </span>
      {:else}
        {progressPercent}
        <CircularProgressBar width={20} progress={$progress} />
      {/if}
    </div>
  {/if}

  {#if imageDropped}
    <span
      class="bg-black bg-opacity-70 hover:bg-gray-900 transition-colors cursor-pointer rounded-full absolute mx-auto bottom-3 px-5 py-2"
      >Replace</span
    >
  {/if}
</div>
