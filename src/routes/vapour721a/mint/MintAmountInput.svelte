<script lang="ts">
  import IconLibrary from "$components/IconLibrary.svelte";

  export let value: number = 0;
</script>

<div
  class="flex flex-row text-2xl items-stretch border-gray-100 border rounded-lg self-start w-full select-none overflow-clip"
>
  <div class="flex-grow justify-center p-4 flex flex-col">
    <input
      class="appearance-none focus:outline-none w-full bg-transparent"
      bind:value
      type="number"
    />
  </div>
  <div class="flex flex-col self-stretch border-l border-white">
    <div
      on:click={() => {
        value++;
      }}
      class="incrementer border-b"
    >
      <IconLibrary icon="up-chevron" color="text-white" />
    </div>
    <div
      on:click={() => {
        value = value - 1 >= 0 ? value - 1 : 0;
      }}
      class="incrementer"
    >
      <IconLibrary icon="down-chevron" color="text-white" />
    </div>
  </div>
</div>

<style lang="postcss">
  .incrementer {
    @apply flex flex-col justify-center items-center border-white self-stretch p-2 hover:bg-gray-100 hover:bg-opacity-20 transition-colors cursor-pointer;
  }
</style>
