<script>
  import { client } from "./../../stores";
  import { signer } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import { ERC20, Stake } from "rain-sdk";
  import { getContext } from "svelte";
  import StakeDepositTable from "./StakeDepositTable.svelte";
  import StakeWithdrawModal from "./StakeWithdrawModal.svelte";
  import StakeWithdrawTable from "./StakeWithdrawTable.svelte";
  import { queryStore } from "@urql/svelte";
  import DepositToken from "./DepositToken.svelte";
  import { push } from "svelte-spa-router";
  import { ethers } from "ethers";
  import { formatUnits } from "ethers/lib/utils";
  import dayjs from "dayjs";
  import { addressValidate } from "$src/validation";

  const { open } = getContext("simple-modal");

  export let params;

  let stakeContract, errorMsg;

  let stakeAddress = params.wild ? params.wild.toLowerCase() : undefined;

  $: stake = queryStore({
    client: $client,
    query: `
    query ($stakeAddress: Bytes!) {
      stakeERC20 (id: $stakeAddress) {
        address
        deployer
        id
        name
        symbol
        initialRatio
        deployTimestamp
        stakeTokenToTokenRatio
        tokenToStakeTokenRatio
        token {
          decimals
          id
          name
          symbol
        }
        decimals
        totalSupply
        tokenPoolSize
        holders {
            id
            balance
        }
      }
    }`,
    variables: { stakeAddress },
    requestPolicy: "network-only",
    pause: params.wild ? false : true,
  });

  $: _stake = $stake.data?.stakeERC20;

  $: if (_stake || $signer) {
    if (!$stake.fetching && _stake != undefined) {
      initContracts();
      // reportMyAddress();
    }
  }

  const initContracts = async () => {
    stakeContract = new Stake(_stake?.address, $signer);

    // erc20Contract = new ERC20(_stake?.token.id, $signer);
  };
</script>

<div class="flex w-full max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl">Stake tokens. </span>
    <span class="text-gray-400"> Stake or unstake tokens. </span>
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
    <FormPanel>
      <div class="flex flex-col gap-y-2 mb-4">
        <span class="text-white">Stake details</span>
        <div class="text-gray-400 flex flex-col">
          <span>Contract Address: {_stake.id}</span>
          <span>Deployer: {_stake.deployer}</span>
          <span>Deployed: {dayjs.unix(_stake.deployTimestamp).toString()}</span>
          <span>Name: {_stake?.name}</span>
          <span>Symbol: {_stake?.symbol}</span>
          <span
            >Total pool size: {formatUnits(
              _stake?.tokenPoolSize,
              ethers.BigNumber.from(_stake?.token.decimals)
            )}</span
          >
          <span>Stake token holders: {_stake?.holders.length}</span>
        </div>
      </div>
      <div class="flex flex-col gap-y-2 mb-4">
        <span class="text-white">ERC20 Token details</span>
        <div class="text-gray-400 flex flex-col">
          <span>Name: {_stake?.token.name}</span>
          <span>Symbol: {_stake?.token?.symbol}</span>
          <span>Address: {_stake?.token?.id}</span>
        </div>
      </div>
      <div class="flex flex-row gap-x-2">
        <Button
          on:click={() => {
            push(`/stake/report/${_stake.address}`);
          }}>Report</Button
        >
      </div>
    </FormPanel>
    <FormPanel heading="Deposit Token">
      <Button
        on:click={() => {
          open(DepositToken, { stakeContract, _stake });
        }}>Deposit</Button
      >
    </FormPanel>
    <FormPanel>
      <StakeDepositTable {_stake} {stakeContract} />
    </FormPanel>
    <FormPanel heading="Withdraw Token">
      <Button
        on:click={() => {
          open(StakeWithdrawModal, { stakeContract, _stake });
        }}>Withdraw</Button
      >
    </FormPanel>
    <FormPanel>
      <StakeWithdrawTable {_stake} {stakeContract} />
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
          push(`/stake/stake/${stakeAddress}`);
        }}
      >
        Load
      </Button>
    </FormPanel>
  {/if}
</div>
