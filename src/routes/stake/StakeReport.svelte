<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import { ethers } from "ethers";
  import { hexlify } from "ethers/lib/utils";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import { tierReport } from "../../utils";
  import { push } from "svelte-spa-router";
  import { queryStore } from "@urql/svelte";
  import { Stake, ERC20 } from "rain-sdk";
  import { getContext } from "svelte";
  import { client } from "$src/stores";
  import DepositToken from "./DepositToken.svelte";
  import StakeWithdrawTable from "./StakeWithdrawTable.svelte";
  import StakeDepositTable from "./StakeDepositTable.svelte";
  import StakeWithdrawModal from "./StakeWithdrawModal.svelte";
  import Switch from "$components/Switch.svelte";
  import Select from "$components/Select.svelte";
  import { addressValidate, required } from "$src/validation";

  const { open } = getContext("simple-modal");

  export let params;

  let stakeContract,
    erc20Contract,
    errorMsg,
    addressToReport,
    parsedReport,
    addressBalance;

  let reportTier, parsedTiers;
  let tierValue: { value: number; label: string } = null;

  const tierValues = [
    { value: 0, label: "Tier 1" },
    { value: 1, label: "Tier 2" },
    { value: 2, label: "Tier 3" },
    { value: 3, label: "Tier 4" },
    { value: 4, label: "Tier 5" },
    { value: 5, label: "Tier 6" },
    { value: 6, label: "Tier 7" },
    { value: 7, label: "Tier 8" },
  ];

  let timeForTierCheck = false;

  let tiers = [];

  let stakeAddress = params.wild ? params.wild.toLowerCase() : undefined;

  $: stake = queryStore({
    client: $client,
    query: `
      query ($stakeAddress: Bytes!) {
        stakeERC20S (where: {id: $stakeAddress}) {
          address
          deployer
          id
          name
          symbol
          initialRatio
          deployTimestamp
          token {
            decimals
            id
            name
            symbol
          }
          decimals
          totalSupply
          tokenPoolSize
        }
      }`,
    variables: { stakeAddress },
    requestPolicy: "network-only",
    pause: params.wild ? false : true,
  });

  $: _stake = $stake.data?.stakeERC20S[0];

  $: if (_stake || $signer) {
    if (!$stake.fetching && _stake != undefined) {
      initContracts();
      // reportMyAddress();
    }
  }

  const initContracts = async () => {
    stakeContract = new Stake(_stake?.address, $signer);

    erc20Contract = new ERC20(_stake?.token.id, $signer);
  };

  const report = async () => {
    if (ethers.utils.isAddress(addressToReport)) {
      parsedTiers = tiers.map((value) =>
        value
          ? ethers.utils.parseUnits(
              value.toString(),
              _stake?.token?.decimals ? _stake?.token?.decimals : 18
            )
          : ethers.constants.MaxInt256
      );

      if (!timeForTierCheck) {
        reportTier = await stakeContract.report(addressToReport, parsedTiers);

        parsedReport = tierReport(reportTier);
      } else {
        reportTier = await stakeContract.reportTimeForTier(
          addressToReport,
          tierValue.value,
          parsedTiers
        );
      }
      addressBalance = await erc20Contract.balanceOf(addressToReport);
    } else {
      errorMsg = "Not a valid Ethereum address";
    }
  };

  const reportMyAddress = () => {
    addressToReport = $signerAddress;
    report();
  };
</script>

<div class="flex w-full max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl"> Get a Stake report. </span>
    <span class="text-gray-400">
      Stake stores the time (block number) when an address joins a tier by
      locking up the required amount of tokens for that tier
    </span>
    {#if !params.wild}
      <span class="text-gray-400">
        Enter a Stake contract address below, or <span
          class="cursor-pointer underline"
          on:click={() => {
            push("/stake/list");
          }}>browse all deployed Stake contracts.</span
        >
      </span>
    {/if}
  </div>
  {#if !$stake.fetching && !$stake.error && $stake.data}
    <FormPanel heading="Get a report of an address">
      <Input
        bind:value={addressToReport}
        type="text"
        placeholder="Enter an Ethereum address"
        validator={addressValidate}
      />
      <div>
        <span
          >Report for {#if !timeForTierCheck}
            all Tier{:else}Single Tier{/if}</span
        >
        <Switch bind:checked={timeForTierCheck} />
      </div>
      {#if timeForTierCheck}
        <div>Select one of the tier for that you want to get the report</div>
        <Select items={tierValues} bind:value={tierValue}>
          <span slot="label"> Select The Tier Status: </span>
        </Select>
      {/if}
      <div class="flex w-full flex-col gap-y-3">
        <Input
          type="number"
          placeholder="Tier 1"
          bind:value={tiers[0]}
          validator={required}
        >
          <span slot="label"
            >Enter the amount of token that must be used as threshold value for
            each of the tiers.</span
          >
        </Input>
        <Input
          type="number"
          placeholder="Tier 2"
          bind:value={tiers[1]}
          validator={required}
        />
        <Input
          type="number"
          placeholder="Tier 3"
          bind:value={tiers[2]}
          validator={required}
        />
        <Input
          type="number"
          placeholder="Tier 4"
          bind:value={tiers[3]}
          validator={required}
        />
        <Input
          type="number"
          placeholder="Tier 5"
          bind:value={tiers[4]}
          validator={required}
        />
        <Input
          type="number"
          placeholder="Tier 6"
          bind:value={tiers[5]}
          validator={required}
        />
        <Input
          type="number"
          placeholder="Tier 7"
          bind:value={tiers[6]}
          validator={required}
        />
        <Input
          type="number"
          placeholder="Tier 8"
          bind:value={tiers[7]}
          validator={required}
        />
      </div>

      <div class="flex flex-row gap-x-2">
        <Button shrink disabled={!addressToReport} on:click={report}
          >Get report</Button
        >
        <Button shrink on:click={reportMyAddress}>Get my report</Button>
      </div>
      <div class="flex flex-col gap-y-2">
        {#if addressBalance}
          <span
            >{addressToReport} Balance: {ethers.utils.formatUnits(
              addressBalance,
              _stake?.token.decimals
            )}
            {_stake?.token.symbol}</span
          >
        {/if}
        <span class="gap-y-1"> Stake Report: </span>
        {#if _stake}
          {#each tiers as value, i}
            {#if timeForTierCheck}
              <span class="text-gray-400">
                Tier {i + 1} : {value}
                {#if value == tierValue?.value + 1 && reportTier?.toHexString() != "0xffffffff" && reportTier != undefined}
                  ✅
                {:else}
                  ❌
                {/if}
              </span>
            {:else}
              <span class="text-gray-400">
                Tier {i + 1} : {value}
                {#if parsedReport ? hexlify(parsedReport?.[i]) != "0xffffffff" : "" && parsedReport != undefined}
                  ✅
                {:else if parsedReport ? hexlify(parsedReport?.[i]) == "0xffffffff" : ""}
                  ❌
                {/if}
              </span>
            {/if}
          {/each}
        {/if}
      </div>
    </FormPanel>
  {:else if errorMsg}
    <span class="text-red-400">{errorMsg}</span>
  {:else if !params.wild}
    <FormPanel>
      <Input
        bind:value={stakeAddress}
        type="address"
        placeholder="Contract address"
        validator={addressValidate}
      />
      <Button
        on:click={() => {
          push(`/stake/report/${stakeAddress}`);
        }}
      >
        Load
      </Button>
    </FormPanel>
  {/if}
</div>
