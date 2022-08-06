<script lang="ts">
  import { AllowedGroup, groupOptions } from "./vapour721a-types";
  import Select from "$components/Select.svelte";

  import type { Group } from "./vapour721a-types";
  import { createEventDispatcher } from "svelte";
  import Input from "$components/Input.svelte";
  import IconLibrary from "$components/IconLibrary.svelte";

  export let group: Group;

  const dispatch = createEventDispatcher();
</script>

<div class="flex flex-row justify-end gap-x-1 items-center">
  <Select items={groupOptions} bind:value={group.type} />
  {#if group?.type == AllowedGroup.Allowlisters}
    <Input
      type="address"
      placeholder="List address"
      bind:value={group.contractAddress}
    >
      <!-- <span slot="label">Price</span> -->
    </Input>
  {:else if group?.type == AllowedGroup.NFTHolders}
    <Input
      type="address"
      placeholder="NFT address"
      bind:value={group.contractAddress}
    />
    <Input
      type="number"
      placeholder="Min balance"
      bind:value={group.minBalance}
    />
  {:else if group?.type == AllowedGroup.SBTHolders}
    <Input
      type="address"
      placeholder="SBT address"
      bind:value={group.contractAddress}
    />
    <Input
      type="number"
      placeholder="Min balance"
      bind:value={group.minBalance}
    />
  {/if}
  <div
    on:click={() => {
      dispatch("remove");
    }}
  >
    <div
      class="opacity-70 hover:opacity-100 cursor-pointer transition-opacity ml-2"
    >
      <IconLibrary icon="close" width={15} />
    </div>
  </div>
</div>
