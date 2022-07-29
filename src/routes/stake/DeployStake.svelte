<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Input from "$components/Input.svelte";
  import { ethers } from "ethers";
  import FormPanel from "$components/FormPanel.svelte";
  import Button from "$components/Button.svelte";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  import { Stake, ERC20, type StakeDeployArgs } from "rain-sdk";
  import { formatUnits } from "ethers/lib/utils";

  let erc20Address,
    erc20AddressError,
    erc20Contract,
    erc20name,
    erc20symbol,
    erc20balance,
    erc20decimals,
    initialRatio;
  let deployPromise;

  $: if (erc20Address) {
    getERC20();
  }

  const getERC20 = async () => {
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
      InitialRatio = ethers.utils
        .parseUnits("1", "36")
        .sub(ethers.utils.parseUnits("1", erc20decimals))
        .mul(ethers.BigNumber.from(initialRatio));
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
      Create Tier statuses corresponding to locking up at least a certain amount
      of an ERC20 in the contract.
    </span>
  </div>
  <FormPanel heading="Stake settings">
    <Input type="address" placeholder="Token address" bind:value={erc20Address}>
      <span slot="label">ERC20 token address</span>
      <span slot="description">
        {#if erc20AddressError}
          <span class="text-red-500">
            {erc20AddressError}
          </span>
        {:else if erc20name && erc20balance}
          <div class="flex flex-col gap-y-2 font-light text-gray-300">
            <span>Token name: {erc20name}</span>
            <span>Token symbol: {erc20symbol}</span>
            <span>Your balance: {formatUnits(erc20balance, erc20decimals)}</span
            >
          </div>
        {/if}
      </span>
    </Input>
    <Input type="text" placeholder="Name" bind:value={erc20name}>
      <span slot="label">Name</span>
    </Input>
    <Input type="text" placeholder="Symbol" bind:value={erc20symbol}>
      <span slot="label">Symbol</span>
    </Input>
    <Input type="text" placeholder="Initial Ratio" bind:value={initialRatio}>
      <span slot="label">Initial Ratio</span>
    </Input>
  </FormPanel>
  <FormPanel>
    <div class="mt-1 flex flex-col gap-y-2">
      {#if !deployPromise}
        <Button shrink on:click={handleClick}>Deploy Stake</Button>
      {:else}
        <ContractDeploy {deployPromise} type="Stake" />
      {/if}
    </div>
  </FormPanel>
</div>
