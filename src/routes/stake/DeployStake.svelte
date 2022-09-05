<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Input from "$components/Input.svelte";
  import { ethers, BigNumber } from "ethers";
  import FormPanel from "$components/FormPanel.svelte";
  import Button from "$components/Button.svelte";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  import { Stake, ERC20, type StakeDeployArgs } from "rain-sdk";
  import { formatUnits } from "ethers/lib/utils";
  import { addressValidate, required } from "$src/validation";
  import Erc20Input from "$components/Erc20Input.svelte";
  import { validateFields } from "$src/utils";

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

  let fields: any = {};

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
      name: stTokenName,
      symbol: stTokenSymbol,
    };

    let newStake = await Stake.deploy($signer, stakeArgs);

    return newStake;
  };

  const handleClick = async () => {
    // validate all fields before proceeding
    const { validationResult } = await validateFields(fields);
    if (!validationResult) return;

    deployPromise = deployStake();
  };
</script>

<div class="flex max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl"> Deploy a new Stake. </span>
    <span class="text-gray-400">
      Deploy a Staking contract with ability to stake the reserve token to
      receive stake tokens (shares) in exchange at the stake token/ reserve
      token ratio where stakers are able to claim prorata shares of stake
      tokens.
    </span>
  </div>
  <FormPanel heading="Stake settings">
    <Erc20Input
      bind:contract={erc20Contract}
      signer={$signer}
      value={erc20Address}
      placeholder="Token address"
      bind:this={fields.token}
    >
      <span slot="label">Reserve Token Address</span>
    </Erc20Input>
    <Input
      type="text"
      placeholder="Name"
      bind:value={stTokenName}
      bind:this={fields.stTokenName}
      validator={required}
    >
      <span slot="label">Stake Token Name</span>
    </Input>
    <Input
      type="text"
      placeholder="Symbol"
      bind:value={stTokenSymbol}
      bind:this={fields.stTokenSymbol}
      validator={required}
    >
      <span slot="label">Stake Token Symbol</span>
    </Input>
    <Input
      type="text"
      placeholder="Initial Ratio"
      bind:value={initialRatio}
      validator={required}
      bind:this={fields.initialRatio}
    >
      <span slot="label">Initial Ratio</span>
      <span slot="description"
        >Initial ratio determines how many stake tokens to get minted when the
        first ever deposit happens compared to how many reserve token gets
        deposited, after the first mint the ratio will be determined by the
        reserve and stake token balances of the stake contract</span
      >
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
  </FormPanel>
</div>
