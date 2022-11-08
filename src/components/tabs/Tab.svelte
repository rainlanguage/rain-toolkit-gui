<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);
</script>

<a
  class="cursor-pointer p-2 text-base text-gray-500 w-26 px-10 rounded-full bg-gray-300"
  class:selected={$selectedTab === tab}
  on:click={() => selectTab(tab)}
>
  <slot />
</a>
<!-- <div class="w-5 border-b border-gray-200" /> -->

<style>
  .selected {
    @apply border-b bg-white text-black font-medium;
  }
</style>