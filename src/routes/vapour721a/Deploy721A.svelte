<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import Erc20Input from "$components/Erc20Input.svelte";
  import FormSubheading from "$components/forms/FormSubheading.svelte";
  import ImageDropzone from "$components/ImageDropzone.svelte";
  import Input from "$components/Input.svelte";
  import { pin } from "$routes/vapour721a/uploadToIPFS";
  import Switch from "$components/Switch.svelte";
  import type { Contract } from "ethers";
  import { addressValidate, required } from "$src/validation";
  import autoAnimate from "@formkit/auto-animate";
  import { validateRoyalty } from "$routes/vapour721a/validators";
  import {
    PricingRules,
    type Phase,
  } from "$routes/vapour721a/vapour721a-types";
  import SalePhase721 from "$routes/vapour721a/SalePhase721.svelte";
  import { arrayAdd, arrayRemove } from "$routes/vapour721a/vapour721a";
  import { afterUpdate, tick } from "svelte";

  let imageFile, uploadComplete;
  let addPhaseBtn;

  // fields
  let name: string,
    symbol: string,
    maxSupply: number,
    currency: string,
    royalty: number,
    recipient: string = $signerAddress,
    owner: string = $signerAddress,
    admin: string = $signerAddress,
    useNativeToken: boolean,
    currencyContract: Contract,
    phases: Phase[] = [
      {
        start: "now",
        end: "forever",
        pricing: {
          type: PricingRules.FixedPrice as PricingRules.FixedPrice,
          startPrice: null,
        },
        allowedGroups: [],
      },
    ],
    erc20Info;

  const addPhase = () => {
    phases = arrayAdd(phases, {
      start: null,
      end: "forever",
      pricing: {
        type: PricingRules.FixedPrice as PricingRules.FixedPrice,
        startPrice: null,
      },
      allowedGroups: [],
    });
    setTimeout(() => {
      addPhaseBtn.scrollIntoView({
        behavior: "smooth",
      });
    }, 300);
  };

  const removePhase = (i: number) => {
    phases = arrayRemove(phases, i);
  };

  $: console.log(phases);
</script>

<div class="flex flex-col gap-y-2 col-span-2 mb-10">
  <span class="text-2xl font-semibold"> Deploy a new Vapour721A.</span>
  <span class="text-gray-400">
    Create Tier statuses corresponding to holding at least a certain amount of
    an ERC20.
  </span>
</div>

<div use:autoAnimate class="flex flex-row gap-x-12 relative items-start">
  <div class="flex-grow w-2/3 gap-4 grid grid-cols-2 justify-start">
    <FormSubheading noRuler>Collection details</FormSubheading>

    <Input
      bind:value={name}
      type="text"
      validator={required}
      placeholder="My Collection"
    >
      <slot slot="label">Name</slot>
    </Input>

    <Input
      bind:value={symbol}
      type="text"
      validator={required}
      placeholder="SYMBOL"
    >
      <slot slot="label">Symbol</slot>
    </Input>

    <Input
      bind:value={maxSupply}
      type="number"
      validator={required}
      placeholder="1000"
    >
      <slot slot="label">Supply</slot>
    </Input>

    <Input
      bind:value={royalty}
      type="number"
      validator={validateRoyalty}
      placeholder="15"
    >
      <slot slot="label">Royalty percentage</slot>
    </Input>

    <div class="flex flex-col gap-y-4">
      <Erc20Input
        disabled={useNativeToken}
        bind:value={currency}
        signer={$signer}
        bind:erc20Info
        bind:contract={currencyContract}
      >
        <span slot="label"> Currency </span>
      </Erc20Input>
      <div class="flex flex-row gap-x-2">
        <span>Use native token </span>
        <Switch bind:checked={useNativeToken} />
      </div>
    </div>

    <FormSubheading>Roles</FormSubheading>

    <Input bind:value={admin} type="address" validator={addressValidate}>
      <slot slot="label">Admin</slot>
    </Input>

    <Input bind:value={recipient} type="address" validator={addressValidate}>
      <slot slot="label">Recipient</slot>
    </Input>

    <Input bind:value={owner} type="address" validator={addressValidate}>
      <slot slot="label">Owner</slot>
    </Input>

    <FormSubheading>Sale</FormSubheading>

    <div class="flex flex-col col-span-full gap-y-2" use:autoAnimate>
      {#each phases as phase, i}
        <SalePhase721
          bind:phase
          {i}
          first={i == 0}
          last={i == phases.length - 1}
          on:remove={() => {
            removePhase(i);
          }}
        />
      {/each}
    </div>
    <div bind:this={addPhaseBtn} class="self-start" on:click={addPhase}>
      <Button small shrink>Add phase</Button>
    </div>
  </div>
  <div class="w-1/3 sticky top-20">
    <ImageDropzone bind:imageFile upload={pin} bind:complete={uploadComplete} />
    <div class="flex flex-col gap-y-2 items-start pt-4">
      <span class="text-3xl">{name || "Name"}</span>
      <span class="bg-gray-200 text-black font-semibold rounded-md p-1 text-sm">
        ${symbol?.toUpperCase() || "SYMBOL"}
      </span>
    </div>
  </div>
</div>
