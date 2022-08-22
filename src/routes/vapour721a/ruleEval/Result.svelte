<script lang="ts">
  import { ethers, type BigNumber } from "ethers";
  import { formatUnits } from "ethers/lib/utils";
  import type { eCurrency } from "rain-sdk";
  import { onMount } from "svelte";

  export let eCurrency: eCurrency, currencyInfo;

  onMount(() => {});
</script>

<div class="grid grid-cols-2 gap-x-2">
  <div
    class="rounded-lg border border-gray-700 bg-gray-800 flex flex-col gap-y-2 p-4"
  >
    <span>Your best price</span>
    <span class="text-2xl font-semibold">
      {#if eCurrency.result.price.eq(ethers.constants.MaxUint256)}
        n/a
      {:else}
        {+formatUnits(
          eCurrency.result.price,
          ethers.BigNumber.from(currencyInfo.decimals)
        )}
        {currencyInfo.symbol}
      {/if}
    </span>
  </div>
  <div
    class="rounded-lg border border-gray-700 bg-gray-800 flex flex-col gap-y-2 p-4"
  >
    <span>The max you can mint</span>
    <span class="text-2xl font-semibold">
      {#if eCurrency.result.quantity.eq(ethers.constants.MaxUint256)}
        n/a
      {:else}
        {eCurrency.result.quantity.toString()}
      {/if}
    </span>
  </div>
</div>
