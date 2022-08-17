<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { connected } from "svelte-ethers-store";
  import { contractAddress, contractInfo, currencyInfo } from "./mint";
  import MintDialog from "$routes/vapour721a/mint/MintDialog.svelte";
  import NextToken from "$routes/vapour721a/mint/NextToken.svelte";
  import HumanReadableVapour from "$routes/vapour721a/HumanReadableVapour.svelte";
  import { onMount } from "svelte";
  import type { Currency } from "rain-sdk";
  import { getAddress } from "ethers/lib/utils";
  import { StorageOps, vapourOpMeta } from "$routes/vapour721a/opMeta";
  import { reviver } from "$src/utils";

  export let params: {
    wild: string;
  };
  let rules: Currency;
  let rulesEval: any;

  $: $contractAddress = params.wild;

  // $: if ($contractAddress)
  //   (async () => {
  //     // rules = JSON.parse(
  //     //   window.localStorage.getItem(getAddress($contractAddress)),
  //     //   reviver
  //     // );
  //     rules = $tempRuleStorage;
  //     console.log(rules);
  //     rulesEval = await RuleBuilder.eval([rules], $signer, {
  //       contract: $contractAddress,
  //       opMeta: vapourOpMeta,
  //       storageOpFn: StorageOps,
  //       context: [$signerAddress, "100"],
  //     });
  //     // console.log(rules, rulesEval);
  //   })();

  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<span in:fade={{ duration: 2000 }} class="font-heading text-6xl text-white"
  >Mint from a Vapour721A</span
>
<div
  class="items-stretch w-full grid grid-cols-7 gap-x-24 mt-12"
  in:fly={{ y: 30, duration: 2000 }}
>
  {#if $connected && $currencyInfo}
    <div class="col-span-4">
      <MintDialog />
      {#if $contractInfo?.vmStateConfig}
        <div class="mt-8">
          <HumanReadableVapour vmStateConfig={$contractInfo.vmStateConfig} />
        </div>
      {/if}
    </div>
    <div class="col-span-3">
      <NextToken />
    </div>
  {/if}
</div>
