<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Input from "$components/Input.svelte";
  import { ethers, BigNumber } from "ethers";
  import FormPanel from "$components/FormPanel.svelte";
  import Button from "$components/Button.svelte";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  import { Stake, ERC20, type StakeDeployArgs } from "rain-sdk";
  import { formatUnits } from "ethers/lib/utils";

  let erc20Address = "0x25a4Dd4cd97ED462EB5228de47822e636ec3E31A",
    erc20AddressError,
    erc20Contract,
    erc20name,
    erc20symbol,
    erc20balance,
    erc20decimals,
    initialRatio = 1;
  let deployPromise;
  let stTokenName = "Stake Token";
  let stTokenSymbol = "stTKN";

  $: if (erc20Address) {
    getERC20();
  }

  const getERC20 = async () => {
    erc20Address = erc20Address.toLowerCase();
    if (ethers.utils.isAddress(erc20Address)) {
      erc20AddressError = null;

      erc20Contract = new ERC20(erc20Address, $signer);

      try {
        erc20name = await erc20Contract.name();
        erc20balance = await erc20Contract.balanceOf($signerAddress);
        erc20decimals = await erc20Contract.decimals();
        erc20symbol = await erc20Contract.symbol();
      } catch {
        erc20AddressError = "not a valid ERC20 token address";
      }
    } else {
      erc20AddressError = "not a valid address";
    }
  };

  const deployStake = async () => {
    let InitialRatio;
    erc20Address = erc20Address.toLowerCase();

    if (initialRatio) {
      InitialRatio = BigNumber.from("1".padEnd(36, "0"))
        .mul(initialRatio)
        .div(BigNumber.from("1".padEnd(erc20decimals, "0")));
    }

    const stakeArgs: StakeDeployArgs = {
      token: erc20Address,
      initialRatio: InitialRatio,
      name: erc20name,
      symbol: erc20symbol,
    };

    let newStake = await Stake.deploy($signer, stakeArgs);

    return newStake;
  };

  const handleClick = () => {
    deployPromise = deployStake();
  };
</script>

<div class="flex max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl"> Deploy a new Stake. </span>
    <span class="text-gray-400">
      Deploy a Staking contract with ability to stake the reserve token to recieve stake tokens (shares) in 
      exchange at the stake token/ reserve token ratio where stakers are able to claim prorata shares of stake tokens.
    </span>
  </div>
  <FormPanel heading="Stake settings">
    <Input type="address" placeholder="Token address" bind:value={erc20Address}>
      <span slot="label">Reserve Token Address</span>
      <span slot="description">
        {#if erc20AddressError}
          <span class="text-red-500">
            {erc20AddressError}
          </span>
        {:else if erc20name && erc20balance}
          <div class="flex flex-col gap-y-2 font-light text-gray-400">
            <span>Name: {erc20name}</span>
            <span>Symbol: {erc20symbol}</span>
            <span>Your balance: {formatUnits(erc20balance, erc20decimals)}</span
            >
          </div>
        {/if}
      </span>
    </Input>
    <Input type="text" placeholder="Name" bind:value={stTokenName}>
      <span slot="label">Stake Token Name</span>
    </Input>
    <Input type="text" placeholder="Symbol" bind:value={stTokenSymbol}>
      <span slot="label">Stake Token Symbol</span>
    </Input>
    <Input type="text" placeholder="Initial Ratio" bind:value={initialRatio}>
      <span slot="label">Initial Ratio</span>
      <span slot="description">Initial ratio determines how many stake tokens to get minted when the first ever deposit
        happens compared to how many reserve token gets deposited, after the first mint the ratio will be determined 
        by the reserve and stake token balances of the stake contract</span>
    </Input>
  </FormPanel>
  <FormPanel>
    <div class="mt-1 flex flex-col gap-y-2">
      {#if !deployPromise}
        <Button shrink on:click={handleClick} disabled={erc20AddressError}
          >Deploy Stake</Button
        >
      {:else}
        <ContractDeploy {deployPromise} type="Stake" />
      {/if}
    </div>
    {#if erc20AddressError}
      <span class="text-red-500">Please enter a valid token address</span>
    {/if}
  </FormPanel>
</div>
