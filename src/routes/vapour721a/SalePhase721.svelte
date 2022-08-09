<script lang="ts">
  import autoAnimate from "@formkit/auto-animate";
  import IconLibrary from "$components/IconLibrary.svelte";
  import Input from "$components/Input.svelte";
  import {
    type Phase,
    AllowedGroup,
  } from "$routes/vapour721a/vapour721a-types";
  import SaleAllowedGroup from "$routes/vapour721a/SaleAllowedGroup.svelte";
  import Button from "$components/Button.svelte";
  import SalePricing from "$routes/vapour721a/SalePricing.svelte";
  import { arrayAdd, arrayRemove } from "$routes/vapour721a/vapour721a";
  import { createEventDispatcher } from "svelte";
  import { required } from "$src/validation";

  export let phase: Phase;
  export let i: number;
  export let first: boolean;
  export let last: boolean;
  export let fields: any[];

  const dispatch = createEventDispatcher();

  const addGroup = () => {
    phase.allowedGroups = arrayAdd(phase.allowedGroups, {
      type: AllowedGroup.Allowlisters as AllowedGroup.Allowlisters,
      contractAddress: null,
    });
  };

  const removeGroup = (i) => {
    phase.allowedGroups = arrayRemove(phase.allowedGroups, i);
  };
</script>

<div
  class="flex flex-col p-4 gap-y-6 shadow-lg bg-gray-900 filter col-span-full border border-gray-700 rounded-lg relative"
>
  <span class="font-semibold">Phase {i + 1}</span>
  {#if !first}
    <div
      class="flex flex-row rounded-md absolute items-center gap-x-2 right-4 text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      on:click={() => {
        dispatch("remove");
      }}
    >
      <IconLibrary icon="close" />
      Remove phase
    </div>
  {/if}

  <div class="flex flex-col gap-y-2">
    <span class="text-sm">Start</span>
    <div class="flex flex-row gap-x-6 items-start">
      {#if phase.start === "now"}
        <div
          class="w-full justify-between flex flex-row text-sm text-gray-300 bg-gray-800 px-4 py-3 rounded-md"
        >
          <span>Now</span>
          <span
            on:click={() => {
              phase.start = null;
            }}
            class="underline cursor-pointer opacity-70 transition-opacity"
            >set start</span
          >
        </div>
      {:else}
        <div class="w-full flex-grow">
          <Input
            type="datetime-local"
            bind:value={phase.start}
            validator={required}
            bind:this={fields[`start-${i}`]}
          />
        </div>
      {/if}
      <div class:opacity-0={!last} class="transition-opacity mt-2">
        <IconLibrary width={15} icon="forward" />
      </div>
      <div
        class:opacity-0={!last}
        class="text-left w-full text-sm text-gray-300 bg-gray-800 px-4 py-3 rounded-md transition-opacity"
      >
        Forever
      </div>
    </div>
    {#if phase.start !== "now" && first}
      <span
        on:click={() => {
          phase.start = "now";
        }}
        class="underline text-sm text-gray-400 cursor-pointer">reset</span
      >
    {/if}
  </div>

  <div class="flex flex-col gap-y-2">
    <SalePricing bind:fields bind:i bind:pricing={phase.pricing} />
  </div>

  <Input type="number" placeholder="No wallet cap" bind:value={phase.walletCap}>
    <span slot="label">Wallet</span>
    <span slot="description"
      >Caps apply for each wallet <span class="italic">across phases</span
      >.</span
    >
  </Input>

  <div use:autoAnimate class="flex flex-col gap-y-2">
    <span class="text-sm">Allowed groups</span>
    {#if !phase.allowedGroups.length}
      <span class="text-sm text-gray-500">No restrictions</span>
    {:else}
      {#each phase.allowedGroups as group, index}
        <SaleAllowedGroup
          bind:group
          i={`${i}-${index}`}
          {fields}
          on:remove={() => {
            removeGroup(i);
          }}
        />
      {/each}
    {/if}
    <!-- <div class="cursor-pointer text-sm" on:click={addGroup}>+ Add group</div> -->
    <div class="self-start" on:click={addGroup}>
      <Button small shrink>Add group</Button>
    </div>
  </div>
</div>
