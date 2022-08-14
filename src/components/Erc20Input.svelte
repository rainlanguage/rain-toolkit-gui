<script lang="ts">
  import { formatUnits, isAddress } from "ethers/lib/utils";
  import { ERC20 } from "rain-sdk";
  import { onMount } from "svelte";

  import Input from "./Input.svelte";
  import Jazzicon from "./Jazzicon.svelte";

  let input;

  export let value, signer, contract, disabled, placeholder;
  let name, symbol, decimals, balance, gotERC20;

  // use this object so you don't have to get this information again in a parent component
  export let erc20Info = {
    ready: false,
    name: null,
    symbol: null,
    decimals: null,
    balance: null,
  };

  // pass thru the validate function from the Input component
  export const validate = () => {
    return input.validate();
  };

  // if the signer changes when we've already validated, we have to re-validate
  $: if (signer) {
    revalidate();
  }

  onMount(() => {
    if (value) input.validate();
  });

  const revalidate = () => {
    if (gotERC20) input.validate();
  };

  const erc20validate = async (value) => {
    gotERC20 = null;
    erc20Info.ready = false;

    if (value == "" || !value) {
      return { error: "Can't be blank" };
    }
    if (!isAddress(value)) {
      return { error: "Not a valid Ethereum address" };
    }

    if (!(await ERC20.isERC20(value, signer))) {
      return { error: "Not an ERC20 token for this chain" };
    }

    contract = new ERC20(value, signer);

    // run all these calls in parallel
    [name, symbol, decimals, balance] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(await signer.getAddress()),
    ]);

    balance = (+formatUnits(balance, decimals)).toFixed(4);

    erc20Info = {
      ready: true,
      name,
      symbol,
      decimals,
      balance,
    };

    gotERC20 = true;

    return true;
  };
</script>

<div class="w-full flex flex-col gap-y-2" class:disabled>
  <Input
    type="address"
    bind:disabled
    bind:value
    bind:this={input}
    validator={erc20validate}
    {placeholder}
  >
    <span slot="label"><slot name="label" /></span>
  </Input>
  {#if gotERC20}
    <div class="flex flex-row gap-x-2 items-center">
      <div
        class="flex flex-row gap-x-2 bg-gray-100 rounded-md p-1 text-sm border text-gray-800 items-center"
      >
        <Jazzicon address={contract.address} width={20} />
        {name} ({symbol})
      </div>
      <div>
        Balance: {balance}
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .disabled {
    @apply opacity-50;
  }
</style>
