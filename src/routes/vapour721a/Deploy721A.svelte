<script lang="ts">
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import ImageDropzone from "$components/ImageDropzone.svelte";
  import Input from "$components/Input.svelte";
  import { pin } from "$routes/vapour721a/uploadToIPFS";

  let imageFile, uploadComplete;

  // fields
  let name, symbol, maxSupply, currency, royalty, recipient, owner, admin;

  $: console.log(imageFile, uploadComplete);
</script>

<div class="flex flex-col gap-y-2 mb-10">
  <span class="text-2xl"> Deploy a new Vapour721A.</span>
  <span class="text-gray-400">
    Create Tier statuses corresponding to holding at least a certain amount of
    an ERC20.
  </span>
</div>

<div class="flex flex-row gap-x-7 relative">
  <div class="flex-grow w-3/5 gap-y-4 flex flex-col justify-start">
    <span class="text-xl">Collection details</span>

    <Input bind:value={name} type="text">
      <slot slot="label">Name</slot>
    </Input>

    <Input bind:value={symbol} type="text">
      <slot slot="label">Symbol</slot>
    </Input>

    <Input bind:value={maxSupply} type="text">
      <slot slot="label">Supply</slot>
    </Input>
  </div>
  <div class="w-2/5 sticky">
    <ImageDropzone bind:imageFile upload={pin} bind:complete={uploadComplete} />
    <div class="flex flex-col gap-y-2 items-start pt-4">
      <span class="text-3xl">{name || "Name"}</span>
      <span class="bg-gray-200 text-black font-semibold rounded-md p-1 text-sm">
        ${symbol?.toUpperCase() || "SYMBOL"}
      </span>
    </div>
  </div>
</div>
