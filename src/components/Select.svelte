<script>
  import { createEventDispatcher } from "svelte";

  export let items = [];
  export let value = items[0].value;

  const dispatch = createEventDispatcher();

  export const validate = () => {
    return {
      ok: true,
      value,
    };
  };
</script>

<div class="flex flex-col gap-y-2">
  {#if $$slots.label}
    <div class="font-light text-gray-100">
      <slot name="label" />
    </div>
  {/if}
  {#if $$slots.description}
    <span class="text-gray-400">
      <slot name="description" />
    </span>
  {/if}
  <div class="self-start rounded-md bg-gray-800 text-white">
    <select
      class="text-light outline-none mr-2 border-none bg-transparent px-4 py-2
      text-gray-400"
      bind:value
      on:change={() => {
        dispatch("change");
      }}
    >
      {#each items as item}
        <option class="text-white" value={item.value}>{item.label}</option>
      {/each}
    </select>
  </div>
</div>
