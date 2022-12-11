<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import DisplayAddress from "./DisplayAddress.svelte";
  import FlashTooltip from "./FlashTooltip.svelte";
  import Jazzicon from "./Jazzicon.svelte";
  import { copyToClipboard } from "$src/utils";
    import IconLibrary from "./IconLibrary.svelte";

  export let address;
  export let label = null;

  export let name;
  export let avatar;
  export let network;

  let tooltip: SvelteComponent;
</script>

<div class="flex flex-col space-y-2 w-max">
  {#if label}
    <span class="text-2xs font-medium uppercase leading-none text-gray-400"
      >{label}</span
    >
  {/if}
  <div class="flex flex-row items-center space-x-2 font-medium">
    {#if !name && !avatar}
      <span class="space-x-2 ">{network?.toUpperCase()} -</span>
      <FlashTooltip message="Copied!" light bind:this={tooltip}>
        <div
          class="inline-flex cursor-pointer flex-row items-center gap-x-2 transition-colors hover:text-gray-500"
          on:click={async () => {
            await copyToClipboard(address);
            tooltip.flash();
          }}
        >
          <DisplayAddress address={address} />
          <!-- <IconLibrary icon="copy" width={15} /> -->
        </div>
      </FlashTooltip>
      <!-- <DisplayAddress {address} /> -->
      <Jazzicon {address} width="24" />
    {/if}
    {#if avatar}
      <img alt="user avatar" src={avatar} class="mr-2" style="width:24px" />
    {/if}
    {#if name}
      {name}
    {/if}
  </div>
</div>
