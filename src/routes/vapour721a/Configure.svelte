<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import Erc20Input from "$components/Erc20Input.svelte";
  import FormSubheading from "$components/forms/FormSubheading.svelte";
  import ImageDropzone from "$components/ImageDropzone.svelte";
  import Input from "$components/Input.svelte";
  import { pin } from "$routes/vapour721a/uploadToIPFS";
  import Switch from "$components/Switch.svelte";
  import { addressValidate, required } from "$src/validation";
  import autoAnimate from "@formkit/auto-animate";
  import { validateRoyalty } from "$routes/vapour721a/validators";
  import type {
    CreateSteps,
    Vapour721AConfig,
  } from "$routes/vapour721a/vapour721a-types";
  import SalePhase721 from "$routes/vapour721a/SalePhase721.svelte";
  import {
    arrayAdd,
    arrayRemove,
    initVapourConfig,
    initVapourPhase,
  } from "$routes/vapour721a/vapour721a";

  let uploadComplete;
  let addPhaseBtn;

  // fields
  export let config: Vapour721AConfig = initVapourConfig($signerAddress);
  export let step: CreateSteps;

  $: console.log(step);

  const addPhase = () => {
    config.phases = arrayAdd(config.phases, initVapourPhase());
    setTimeout(() => {
      addPhaseBtn.scrollIntoView({
        behavior: "smooth",
      });
    }, 300);
  };

  const removePhase = (i: number) => {
    config.phases = arrayRemove(config.phases, i);
  };
</script>

<div class="flex flex-col gap-y-2 col-span-2 mb-10">
  <span class="text-2xl font-semibold"> Create a new NFT collection.</span>
  <span class="text-gray-400">
    Deploy a Vapour721A, with a scriptable pricing, gating and soulbound rules.
  </span>
</div>

<div use:autoAnimate class="flex flex-row gap-x-12 relative items-start">
  <div class="flex-grow w-2/3 gap-4 grid grid-cols-2 justify-start">
    <FormSubheading noRuler>Collection details</FormSubheading>

    <Input
      bind:value={config.name}
      type="text"
      validator={required}
      placeholder="My Collection"
    >
      <slot slot="label">Name</slot>
    </Input>

    <Input
      bind:value={config.symbol}
      type="text"
      validator={required}
      placeholder="SYMBOL"
    >
      <slot slot="label">Symbol</slot>
    </Input>

    <Input
      bind:value={config.description}
      type="textarea"
      validator={required}
      placeholder="My amazing collection."
    >
      <slot slot="label">Description</slot>
    </Input>

    <Input
      bind:value={config.maxSupply}
      type="number"
      validator={required}
      placeholder="1000"
    >
      <slot slot="label">Supply</slot>
    </Input>

    <Input
      bind:value={config.royalty}
      type="number"
      validator={validateRoyalty}
      placeholder="15"
    >
      <slot slot="label">Royalty percentage</slot>
    </Input>

    <div class="flex flex-col gap-y-4">
      <Erc20Input
        disabled={config.useNativeToken}
        bind:value={config.currency}
        signer={$signer}
        bind:erc20Info={config.erc20info}
        bind:contract={config.currencyContract}
      >
        <span slot="label"> Currency </span>
      </Erc20Input>
      <div class="flex flex-row gap-x-2">
        <span>Use native token </span>
        <Switch bind:checked={config.useNativeToken} />
      </div>
    </div>

    <FormSubheading>Roles</FormSubheading>

    <Input bind:value={config.admin} type="address" validator={addressValidate}>
      <slot slot="label">Admin</slot>
      <slot slot="description"
        >The admin can grant other senders access to the mintNFTto function.</slot
      >
    </Input>

    <Input
      bind:value={config.recipient}
      type="address"
      validator={addressValidate}
    >
      <slot slot="label">Recipient</slot>
      <slot slot="description"
        >The address that can withdraw funds, and that receives royalties.</slot
      >
    </Input>

    <Input bind:value={config.owner} type="address" validator={addressValidate}>
      <slot slot="label">Owner</slot>
      <slot slot="description"
        >The owner has no privileges on the contract, but can set collection
        details and royalties on marketplaces like Opensea.</slot
      >
    </Input>

    <FormSubheading>Sale</FormSubheading>

    <div class="flex flex-col col-span-full gap-y-2" use:autoAnimate>
      {#each config.phases as phase, i}
        <SalePhase721
          bind:phase
          {i}
          first={i == 0}
          last={i == config.phases.length - 1}
          on:remove={() => {
            removePhase(i);
          }}
        />
      {/each}
    </div>
    <div
      bind:this={addPhaseBtn}
      class="self-start col-span-full"
      on:click={addPhase}
    >
      <Button small shrink>Add phase</Button>
    </div>
    <FormSubheading>Soulbound</FormSubheading>

    <div class="flex flex-row gap-x-2 col-span-full">
      <Switch bind:checked={config.soulbound} />
      <div>Make this NFT soulbound (non-transferrable) once minted..</div>
    </div>

    <div class="col-span-full py-8 space-y-10">
      <div class="text-center text-2xl mb-3">
        Ready to release this to the universe? 🌐
      </div>
      <div
        class="opacity-80 hover:opacity-100 transition-opacity cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-lg rounded-md py-3 text-center"
        on:click={() => {
          step++;
        }}
      >
        Review and deploy
      </div>
    </div>
  </div>
  <div class="w-1/3 sticky top-20">
    <ImageDropzone
      bind:imageFile={config.imageFile}
      upload={pin}
      bind:complete={uploadComplete}
    />
    <div class="flex flex-col gap-y-2 items-start pt-4">
      <span class="text-3xl">{config.name || "Name"}</span>
      <span class="bg-gray-200 text-black font-semibold rounded-md p-1 text-sm">
        ${config.symbol?.toUpperCase() || "SYMBOL"}
      </span>
      <div class="mt-2">
        {config.description || "An indescribably good collection."}
      </div>
    </div>
  </div>
</div>
