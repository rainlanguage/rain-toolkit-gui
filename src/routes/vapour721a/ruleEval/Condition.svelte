<script lang="ts">
  import { signer } from "svelte-ethers-store";
  import { formatAddress } from "$src/utils";
  import DisplayAddress from "$components/DisplayAddress.svelte";
  import { ethers } from "ethers";
  import { naturalLanguageCondition } from "$routes/vapour721a/ruleEval/ruleEval";
  import IconLibrary from "$components/IconLibrary.svelte";

  export let condition;

  let conditionPromise = naturalLanguageCondition(condition, $signer);
</script>

<div
  class="border rounded-lg bg-gray-900"
  class:border-red-800={!condition.result}
  class:border-green-800={condition.result}
>
  {#await conditionPromise}
    ...
  {:then string}
    {#if string?.length}
      <div class="flex flex-row justify-start p-2 items-center gap-x-2">
        {#if condition.result}
          <IconLibrary icon="tick" color="text-green-700" />
        {:else}
          <IconLibrary icon="close" color="text-red-700" />
        {/if}
        {[string]}
      </div>
    {/if}
  {/await}

  {#if condition?.conditions}
    <div class="flex flex-col p-2 gap-y-2">
      {#each condition.conditions as childCondition, i}
        <svelte:self condition={childCondition} />
        {#if i !== condition.conditions.length - 1}
          <span>{condition.operator}</span>
        {/if}
      {/each}
    </div>
  {/if}
</div>
