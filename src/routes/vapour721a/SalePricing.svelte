<script lang="ts">
  import Input from "$components/Input.svelte";
  import Select from "$components/Select.svelte";
  import {
    pricingOptions,
    PricingRules,
  } from "$routes/vapour721a/vapour721a-types";
  export let pricing;
</script>

<div class="flex flex-row items-end justify-end gap-x-1">
  <div class="flex flex-col gap-y-2">
    <span class="text-sm">Pricing rule</span>
    <Select items={pricingOptions} bind:value={pricing.type} />
  </div>
  {#if pricing?.type == PricingRules.FixedPrice}
    <Input type="number" placeholder="Price" bind:value={pricing.startPrice}>
      <span slot="label">Price</span>
    </Input>
  {:else if pricing?.type == PricingRules.StartEndPrice}
    <Input
      type="number"
      placeholder="Start price"
      bind:value={pricing.startPrice}
    >
      <span slot="label">Start</span>
    </Input>
    <Input type="number" placeholder="End price" bind:value={pricing.endPrice}>
      <span slot="label">End</span>
    </Input>
  {:else if pricing?.type == PricingRules.LinearIncrease}
    <Input type="number" bind:value={pricing.startPrice}>
      <span slot="label">Start price</span>
    </Input>
    <Input type="number" bind:value={pricing.increase}>
      <span slot="label">Increase per period</span>
    </Input>
    <Input bind:value={pricing.period}>
      <span slot="label">Period</span>
    </Input>
  {/if}
</div>
