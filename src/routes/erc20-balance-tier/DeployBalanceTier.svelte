<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Input from "$components/Input.svelte";
  import { ethers } from "ethers";
  import FormPanel from "$components/FormPanel.svelte";
  import Button from "$components/Button.svelte";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  import { ERC20, CombineTier } from "rain-sdk";
  import { formatUnits } from "ethers/lib/utils";
  import Erc20Input from "$components/Erc20Input.svelte";
  import { validateFields } from "$src/utils";
  import { required } from "$src/validation";

  let erc20Address = "0x25a4Dd4cd97ED462EB5228de47822e636ec3E31A",
    erc20AddressError,
    erc20Contract,
    erc20name,
    erc20symbol,
    erc20balance,
    erc20decimals;
  let deployPromise;
  let tiers = [];

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

  const deployBalanceTier = async () => {
    // erc20Address = erc20Address.toLowerCase();

    const parsedTiers = tiers.map((value) =>
      value
        ? ethers.utils.parseUnits(value.toString(), erc20decimals).toHexString()
        : ethers.constants.MaxInt256.toHexString()
    );

    let newBalanceTier = await CombineTier.deployBalanceTier(erc20Contract.address, "erc20", parsedTiers, $signer);

    return newBalanceTier;
  };

  const handleClick = async () => {
    const { validationResult } = await validateFields(fields);
    if (!validationResult) return;

    deployPromise = deployBalanceTier();
  };
</script>

<div class="flex max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl"> Deploy a new BalanceTier. </span>
    <span class="text-gray-400">
      Create Tier statuses corresponding to holding at least a certain amount of
      an ERC20.
    </span>
  </div>
  <FormPanel heading="BalanceTier settings">
    <Erc20Input
      bind:contract={erc20Contract}
      signer={$signer}
      value={erc20Address}
      placeholder="Token address"
      bind:this={fields.token}
    >
      <span slot="label">Reserve Token Address</span>
    </Erc20Input>
    <div class="flex w-full flex-col gap-y-3">
      <Input
        type="number"
        placeholder="Tier 1"
        bind:value={tiers[0]}
        bind:this={fields.tiers1}
        validator={required}
      >
        <span slot="label"
          >Set the amount of token that must be held for each of the tiers.</span
        >
      </Input>
      <Input
        type="number"
        placeholder="Tier 2"
        bind:value={tiers[1]}
        bind:this={fields.tiers2}
        validator={required}
      />
      <Input
        type="number"
        placeholder="Tier 3"
        bind:value={tiers[2]}
        bind:this={fields.tiers3}
        validator={required}
      />
      <Input
        type="number"
        placeholder="Tier 4"
        bind:value={tiers[3]}
        bind:this={fields.tiers4}
        validator={required}
      />
      <Input
        type="number"
        placeholder="Tier 5"
        bind:value={tiers[4]}
        bind:this={fields.tiers5}
        validator={required}
      />
      <Input
        type="number"
        placeholder="Tier 6"
        bind:value={tiers[5]}
        bind:this={fields.tiers6}
        validator={required}
      />
      <Input
        type="number"
        placeholder="Tier 7"
        bind:value={tiers[6]}
        bind:this={fields.tiers7}
        validator={required}
      />
      <Input
        type="number"
        placeholder="Tier 8"
        bind:value={tiers[7]}
        bind:this={fields.tiers8}
        validator={required}
      />
    </div>
  </FormPanel>
  <FormPanel>
    <div class="mt-1 flex flex-col gap-y-2">
      {#if !deployPromise}
        <Button shrink on:click={handleClick}>Deploy BalanceTier</Button>
      {:else}
        <ContractDeploy {deployPromise} type="CombineTier" />
      {/if}
    </div>
  </FormPanel>
</div>
