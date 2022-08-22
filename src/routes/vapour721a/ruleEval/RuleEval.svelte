<script lang="ts">
  import Ring from "$components/Ring.svelte";
  import Switch from "$components/Switch.svelte";
  import HumanReadableVapour from "$routes/vapour721a/HumanReadableVapour.svelte";
  import Defaults from "$routes/vapour721a/ruleEval/Defaults.svelte";
  import Result from "$routes/vapour721a/ruleEval/Result.svelte";
  import Rule from "$routes/vapour721a/ruleEval/Rule.svelte";
  import type { Signer } from "ethers";
  import {
    RuleBuilder,
    type Currency,
    type eCurrency,
    type StateConfig,
  } from "rain-sdk";

  export let rules: Currency,
    currencyInfo,
    signer: Signer,
    contract: string,
    vmStateConfig: StateConfig[],
    opMeta,
    storageOpFn;
  let rulesEval: eCurrency[];
  let evaluatePromise: Promise<void>;
  let seeHRS: false;

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

  $: console.log({ vmStateConfig }, seeHRS);
</script>

{#if evaluatePromise}
  {#await evaluatePromise}
    <div class="flex flex-rowg gap-x-4">
      <Ring color="#FFF" size="20px" />
      <span> Evaluating rules for this mint... </span>
    </div>
  {:then}
    <div class="flex flex-col gap-y-4">
      {#each rulesEval as eCurrency, currencyNo}
        <Result {eCurrency} {currencyInfo} />

        <div class="flex flex-row justify-between items-end mt-4">
          <span class="text-2xl">Rules</span>
          <div>
            <span class="text-gray-200">View the source for these rules</span>
            <Switch bind:checked={seeHRS} />
          </div>
        </div>

        {#if !seeHRS}
          {#each eCurrency.rules as rule, i}
            <Rule {rule} {i} {currencyInfo} />
          {/each}
          <Defaults {eCurrency} {currencyInfo} />
        {/if}

        {#if vmStateConfig && seeHRS}
          <HumanReadableVapour
            numberOfRules={eCurrency.rules.length}
            vmStateConfig={vmStateConfig[currencyNo]}
          />
        {/if}
      {/each}
    </div>
  {/await}
{/if}
