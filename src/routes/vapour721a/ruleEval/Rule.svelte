<script lang="ts">
  import { signerAddress, signer } from "svelte-ethers-store";
  import { contractAddress } from "./../mint/mint";
  import { StorageOps, vapourOpMeta } from "$routes/vapour721a/opMeta";
  import Condition from "$routes/vapour721a/ruleEval/Condition.svelte";
  import { constants, ethers } from "ethers";
  import { formatUnits } from "ethers/lib/utils";
  import { RainJSVM, type eRule } from "rain-sdk";
  import { onMount } from "svelte";
  import IconLibrary from "$components/IconLibrary.svelte";

  export let rule: eRule, i, currencyInfo;
  let quantityEval, priceEval, result;

  onMount(async () => {
    if ("sources" in rule.price.struct) {
      const priceVM = new RainJSVM(rule.price.struct, {
        signer: $signer,
        contract: $contractAddress,
        opMeta: vapourOpMeta,
        storageOpFn: StorageOps,
      });
      priceEval = (await priceVM.run({ context: [$signerAddress, "1"] }))[0];
    } else if (
      "subject" in rule.price.struct &&
      rule.price.struct.subject == "constant"
    ) {
      priceEval = rule.price.struct.args.value;
    }

    if ("sources" in rule.quantity.struct) {
      const quantityVM = new RainJSVM(rule.quantity.struct, {
        signer: $signer,
        contract: $contractAddress,
        opMeta: vapourOpMeta,
        storageOpFn: StorageOps,
      });
      quantityEval = (
        await quantityVM.run({ context: [$signerAddress, "1"] })
      )[0];
    } else if (
      "subject" in rule.quantity.struct &&
      rule.quantity.struct.subject == "constant"
    ) {
      quantityEval = rule.quantity.struct.args.value;
    }

    if (
      !(rule.priceConditions === "always" || rule.priceConditions === "never")
    ) {
      result = rule.priceConditions.result;
    }
  });
</script>

<div
  class={`bg-gray-800 rounded-lg ${
    result ? "shadow-lg shadow-green-800/40" : ""
  }`}
  class:bg-red-800={!result}
  class:bg-green-800={result}
>
  <div class="flex flex-row items-center justify-between px-2 py-4 gap-x-2">
    {#if priceEval && quantityEval}
      <div class="flex flex-row items-center gap-x-4">
        {#if result}
          <IconLibrary icon="tick" width={30} />
        {:else}
          <IconLibrary icon="close" width={30} />
        {/if}
        <div class="" class:line-through={!result}>
          {#if quantityEval.eq(ethers.constants.MaxUint256)}
            Mint any amount
          {:else}
            Mint up to {ethers.BigNumber.from(quantityEval)} units
          {/if}
          for
          {+formatUnits(
            ethers.BigNumber.from(priceEval),
            currencyInfo.decimals
          )}
          {currencyInfo.symbol} each
        </div>
      </div>
    {/if}
    <span class="bg-gray-800 rounded-full px-3 py-1">Rule {i + 1}</span>
  </div>
  <Condition condition={rule.quantityConditions} />
</div>
