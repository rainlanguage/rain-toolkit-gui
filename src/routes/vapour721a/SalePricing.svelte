<script lang="ts">
  import autoAnimate from "@formkit/auto-animate";
  import Input from "$components/Input.svelte";
  import Select from "$components/Select.svelte";
  import {
    pricingOptions,
    PricingRules,
  } from "$routes/vapour721a/vapour721a-types";
  import { required } from "$src/validation";
  export let pricing;
  export let fields: any;
  export let i: number;
</script>

<div class="flex flex-row items-start justify-start gap-x-1">
  <div class="flex flex-col gap-y-2">
    <span class="text-sm">Pricing rule</span>
    <Select items={pricingOptions} bind:value={pricing.type} />
  </div>
  {#if pricing?.type == PricingRules.FixedPrice}
    <Input
      validator={required}
      type="number"
      placeholder="Price"
      bind:this={fields[`startPrice-${i}`]}
      bind:value={pricing.startPrice}
    >
      <span slot="label">Price</span>
    </Input>
  {:else if pricing?.type == PricingRules.StartEndPrice}
    <Input
      validator={required}
      type="number"
      placeholder="Start price"
      bind:this={fields[`startPrice-${i}`]}
      bind:value={pricing.startPrice}
    >
      <span slot="label">Start</span>
    </Input>
    <Input
      validator={required}
      bind:this={fields[`endPrice-${i}`]}
      type="number"
      placeholder="End price"
      bind:value={pricing.endPrice}
    >
      <span slot="label">End</span>
    </Input>
  {:else if pricing?.type == PricingRules.LinearIncrease}
    <Input
      validator={required}
      bind:this={fields[`startPrice-${i}`]}
      type="number"
      bind:value={pricing.startPrice}
    >
      <span slot="label">Start price</span>
    </Input>
    <Input
      validator={required}
      bind:this={fields[`priceIncrease-${i}`]}
      type="number"
      bind:value={pricing.increase}
    >
      <span slot="label">Increase per period</span>
    </Input>
    <Input
      validator={required}
      bind:this={fields[`period-${i}`]}
      bind:value={pricing.period}
    >
      <span slot="label">Period</span>
    </Input>
  {/if}
</div>
