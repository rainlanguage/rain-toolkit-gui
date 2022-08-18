<script lang="ts">
  import { onMount } from "svelte";
  import { RainJSVM, type eCurrency, type Rule } from "rain-sdk";
  import { formatUnits } from "ethers/lib/utils";
  import { BigNumber, ethers } from "ethers";

  export let eCurrency: eCurrency, currencyInfo: any;
  let priceVM, quantityVM, priceEval: BigNumber, quantityEval: BigNumber;

  onMount(async () => {
    if ("sources" in eCurrency.default.price.struct) {
      priceVM = new RainJSVM(eCurrency.default.price.struct);
      priceEval = (await priceVM.run())[0];
    }
    if ("sources" in eCurrency.default.quantity.struct) {
      quantityVM = new RainJSVM(eCurrency.default.quantity.struct);
      quantityEval = (await quantityVM.run())[0];
    }
  });
</script>

<div class="bg-gray-700 rounded-lg">
  <div class="p-2">If no rules apply</div>
  <div class="bg-gray-900 border border-gray-700 p-2">
    {#if priceEval && quantityEval}
      {#if quantityEval.isZero()}
        you can't mint.
      {:else}
        Price: {formatUnits(
          ethers.BigNumber.from(priceEval),
          ethers.BigNumber.from(currencyInfo.decimals)
        )}
        Quantity: {formatUnits(
          ethers.BigNumber.from(quantityEval),
          ethers.BigNumber.from("1")
        )}
      {/if}
    {/if}
  </div>
</div>
