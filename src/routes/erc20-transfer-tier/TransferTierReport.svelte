<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import { ethers } from "ethers";
  import FormPanel from "../../components/FormPanel.svelte";
  import Input from "../../components/Input.svelte";
  import Button from "../../components/Button.svelte";
  import { tierReport } from "../../utils";
  import { push } from "svelte-spa-router";
  import { operationStore, query } from "@urql/svelte";
  import { ERC20TransferTier, ERC20 } from "rain-sdk";

  export let params;

  let transferTierContract,
    erc20Contract,
    errorMsg,
    addressToReport,
    parsedReport,
    addressBalance,
    transferTierAddress;

  const transferTier = operationStore(
    `
query ($transferTierAddress: Bytes!) {
  erc20TransferTiers (where: {id: $transferTierAddress}) {
    id
    address
    deployBlock
    deployTimestamp
    deployer
    token {
      id
      name
      symbol
      decimals
    }
    tierValues
  }
}
`,
    { transferTierAddress },
    {
      pause: true,
      requestPolicy: "network-only",
    }
  );

  query(transferTier);

  $: if (params.wild) {
    runQuery();
  }
  const runQuery = () => {
    $transferTier.variables.transferTierAddress = params.wild.toLowerCase();
    $transferTier.context.pause = false;
    $transferTier.reexecute();
  };

  $: _transferTier = $transferTier.data?.erc20TransferTiers[0];

  $: if (_transferTier) {
    initContracts();
  }

  const initContracts = async () => {
    transferTierContract = new ERC20TransferTier(
      _transferTier.address,
      $signer,
      _transferTier.token.id
    );

    erc20Contract = new ERC20(_transferTier.token.id, $signer);
  };

  const report = async () => {
    if (ethers.utils.isAddress(addressToReport)) {
      const report = await transferTierContract.report(addressToReport);
      parsedReport = tierReport(report);
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
    <span class="text-2xl"> Get a TransferTier report. </span>
    <span class="text-gray-400">
      TransferTier checks the amount of a specific ERC20 held in a wallet.
    </span>
    {#if !params.wild}
      <span class="text-gray-400">
        Enter a TransferTier contract address below, or <span
          class="cursor-pointer underline"
          on:click={() => {
            push("/erc20transfertier/list");
          }}>browse all deployed TransferTier contracts.</span
        >
      </span>
    {/if}
  </div>
  {#if !$transferTier.fetching && !$transferTier.error && $transferTier.data}
    <FormPanel heading="ERC20 used for this TransferTier">
      <div class="mb-4 flex flex-col gap-y-2">
        <div class="flex flex-col text-gray-400">
          <span>Name: {_transferTier?.token.name}</span>
          <span>Symbol: {_transferTier?.token.symbol}</span>
          <span>Address: {_transferTier?.token.id}</span>
        </div>
      </div>
    </FormPanel>
    <FormPanel heading="Get a report on an address">
      <Input
        bind:value={addressToReport}
        type="text"
        placeholder="Enter an Ethereum address"
      />
      <div class="flex flex-row gap-x-2">
        <Button shrink on:click={report}>Get a report</Button>
        <Button shrink on:click={reportMyAddress}>Report my address</Button>
      </div>
      <div class="flex flex-col gap-y-2">
        <span class="text-lg">Token values for this TransferTier:</span>
        {#each _transferTier.tierValues as value, i}
          <span class="text-gray-400">
            Tier {i + 1}: {ethers.utils.formatUnits(
              value,
              _transferTier.token.decimals
            )}
            {#if parsedReport?.[i] == 0}
              ✅
            {:else if parsedReport?.[i] > 0}
              ❌
            {/if}
          </span>
        {/each}
      </div>
      {#if addressBalance}
        <span
          >Balance for {addressToReport}: {ethers.utils.formatUnits(
            addressBalance,
            _transferTier.token.decimals
          )}
          {_transferTier.token.symbol}</span
        >
      {/if}
    </FormPanel>
  {:else if errorMsg}
    <span class="text-red-400">{errorMsg}</span>
  {:else if !params.wild}
    <FormPanel>
      <Input
        bind:value={transferTierAddress}
        type="address"
        placeholder="Contract address"
      />
      <Button
        on:click={() => {
          push(`/erc20transfertier/report/${transferTierAddress}`);
        }}
      >
        Load
      </Button>
    </FormPanel>
  {/if}
</div>