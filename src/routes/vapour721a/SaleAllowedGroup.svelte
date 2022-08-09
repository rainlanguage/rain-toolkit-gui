<script lang="ts">
  import { AllowedGroup, groupOptions } from "./vapour721a-types";
  import Select from "$components/Select.svelte";

  import type { Group } from "./vapour721a-types";
  import { createEventDispatcher } from "svelte";
  import Input from "$components/Input.svelte";
  import IconLibrary from "$components/IconLibrary.svelte";
  import { required } from "$src/validation";

  export let group: Group;
  export let i: string;
  export let fields: any;

  const dispatch = createEventDispatcher();
</script>

<div class="flex flex-row justify-end gap-x-1 items-start">
  <Select items={groupOptions} bind:value={group.type} />
  {#if group?.type == AllowedGroup.Allowlisters}
    <Input
      bind:this={fields[`group-contractAddress-${i}`]}
      type="address"
      placeholder="List address"
      bind:value={group.contractAddress}
      validator={required}
    >
      <!-- <span slot="label">Price</span> -->
    </Input>
  {:else if group?.type == AllowedGroup.NFTHolders}
    <Input
      bind:this={fields[`group-contractAddress-${i}`]}
      type="address"
      placeholder="NFT address"
      bind:value={group.contractAddress}
      validator={required}
    />
    <Input
      bind:this={fields[`group-minBalance-${i}`]}
      type="number"
      placeholder="Min balance"
      bind:value={group.minBalance}
      validator={required}
    />
  {:else if group?.type == AllowedGroup.SBTHolders}
    <Input
      bind:this={fields[`group-contractAddress-${i}`]}
      type="address"
      placeholder="SBT address"
      bind:value={group.contractAddress}
      validator={required}
    />
    <Input
      bind:this={fields[`group-minBalance-${i}`]}
      type="number"
      placeholder="Min balance"
      bind:value={group.minBalance}
      validator={required}
    />
  {/if}
  <div
    on:click={() => {
      dispatch("remove");
    }}
  >
    <div
      class="opacity-70 hover:opacity-100 cursor-pointer transition-opacity ml-2 mt-2"
    >
      <IconLibrary icon="close" width={15} />
    </div>
  </div>
</div>
