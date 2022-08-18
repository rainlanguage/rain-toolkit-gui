<script lang="ts">
  import Ring from "$components/Ring.svelte";
  import Defaults from "$routes/vapour721a/ruleEval/Defaults.svelte";
  import Result from "$routes/vapour721a/ruleEval/Result.svelte";
  import Rule from "$routes/vapour721a/ruleEval/Rule.svelte";
  import type { Signer } from "ethers";
  import { RuleBuilder, type Currency, type eCurrency } from "rain-sdk";

  export let rules: Currency,
    currencyInfo,
    signer: Signer,
    contract: string,
    opMeta,
    storageOpFn;
  let rulesEval: eCurrency[];
  let evaluatePromise: Promise<void>;

  const evaluate = async (rules, signer) => {
    rulesEval = await RuleBuilder.eval([rules], signer, {
      contract,
      opMeta,
      storageOpFn,
      context: [await signer.getAddress(), "100"],
    });
  };

  $: if (signer) {
    evaluatePromise = evaluate(rules, signer);
  }
</script>

{#if evaluatePromise}
  {#await evaluatePromise}
    <div class="flex flex-rowg gap-x-4">
      <Ring color="#FFF" size="20px" />
      <span> Evaluating rules for this mint... </span>
    </div>
  {:then}
    <div class="flex flex-col gap-y-4">
      {#each rulesEval as eCurrency}
        <Result {eCurrency} {currencyInfo} />
        <span class="text-2xl">Rules</span>
        {#each eCurrency.rules as rule, i}
          <Rule {rule} {i} {currencyInfo} />
        {/each}
        <Defaults {eCurrency} {currencyInfo} />
      {/each}
    </div>
  {/await}
{/if}
