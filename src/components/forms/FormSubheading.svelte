<script lang="ts">
  export let noRuler = false;
</script>

<div class="col-span-full">
  {#if !noRuler}
    <div class="border-t border-gray-600 my-10" />
  {/if}
  <span class="text-xl font-semibold">
    <slot />
  </span>
</div>
