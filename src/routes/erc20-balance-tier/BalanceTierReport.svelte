<!-- <script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import { ethers } from "ethers";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import { tierReport } from "../../utils";
  import { push } from "svelte-spa-router";
  import { queryStore } from "@urql/svelte";
  import { client } from "$src/stores";
  import { ERC20BalanceTier, ERC20, CombineTier } from "rain-sdk";
  import { addressValidate, required } from "$src/validation";

  export let params;

  let balanceTierContract,
    erc20Contract,
    errorMsg,
    addressToReport,
    parsedReport,
    addressBalance,
    tokenDecimals,
    tokenName,
    tokenSymbol;

  let balanceTierAddress = params.wild ? params.wild.toLowerCase() : undefined;

  $: balanceTier = queryStore({
    client: $client,
    query: `query ($balanceTierAddress: Bytes!) {
      combineTiers(where: {id: $balanceTierAddress}) {
        address
        deployer
        id
        state {
          constants
          id
          sources
        }
      }
    }`,
    variables: { balanceTierAddress },
    requestPolicy: "network-only",
    pause: params.wild ? false : true,
  });

  // $: balanceTier = queryStore({
  //   client: $client,
  //   query: `query ($address: Bytes) {
  //       combineTier (id: $address) {
  //         id
  //         address
  //         deployBlock
  //         deployTimestamp
  //         deployer
  //         state {
  //           sources
  //           constants
  //         }
  //       }
  //     }`,
  //   variables: { address: balanceTierAddress },
  //       requestPolicy: "network-only",
  //   pause: params.wild ? false : true,
  // });

  $: _balanceTier = $balanceTier?.data?.combineTiers;

  $: if (_balanceTier || $signer) {
    if (!$balanceTier.fetching && _balanceTier != undefined) {
      initContracts();
    }
  }

  $: tierLevels = [
    _balanceTier?.state?.constants[1].toString(16),
    _balanceTier?.state?.constants[2].toString(16),
    _balanceTier?.state?.constants[3].toString(16),
    _balanceTier?.state?.constants[4].toString(16),
    _balanceTier?.state?.constants[5].toString(16),
    _balanceTier?.state?.constants[6].toString(16),
    _balanceTier?.state?.constants[7].toString(16),
    _balanceTier?.state?.constants[8].toString(16),
  ]

  const initContracts = async () => {
    if (_balanceTier) {
      balanceTierContract = new CombineTier(
        _balanceTier?.address,
        $signer
      );

      erc20Contract = new ERC20(_balanceTier?.state?.constants[0].toString(16), $signer);
      tokenDecimals = await erc20Contract.decimals();
      tokenName = await erc20Contract.name();
      tokenSymbol = await erc20Contract.symbol();
    }
    else if (params) {
      errorMsg = "Not a valid CombineTier address";
    }
  };

  const report = async () => {
    if (ethers.utils.isAddress(addressToReport)) {
      const report = await balanceTierContract.report(addressToReport);
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
    <span class="text-2xl"> Get a BalanceTier report. </span>
    <span class="text-gray-400">
      BalanceTier checks the amount of a specific ERC20 held in a wallet.
    </span>
    {#if !params.wild}
      <span class="text-gray-400">
        Enter a BalanceTier contract address below, or <span
          class="cursor-pointer underline"
          on:click={() => {
            push("/erc20balancetier/list");
          }}>browse all deployed BalanceTier contracts.</span
        >
      </span>
    {/if}
  </div>
  {#if !$balanceTier.fetching && !$balanceTier.error && $balanceTier.data}
    <FormPanel heading="ERC20 used for this BalanceTier">
      <div class="mb-4 flex flex-col gap-y-2">
        <div class="flex flex-col text-gray-400">
          <span>Name: {tokenName}</span>
          <span>Symbol: {tokenSymbol}</span>
          <span>Address: {erc20Contract.address}</span>
        </div>
      </div>
    </FormPanel>
    <FormPanel heading="Get a report on an address">
      <Input
        bind:value={addressToReport}
        type="text"
        placeholder="Enter an Ethereum address"
        validator={required}
      />
      <div class="flex flex-row gap-x-2">
        <Button shrink on:click={report}>Get a report</Button>
        <Button shrink on:click={reportMyAddress}>Report my address</Button>
      </div>
      <div class="flex flex-col gap-y-2">
        <span class="text-lg">Token values for this BalanceTier:</span>
        {#if _balanceTier && tierLevels.length}
          {#each tierLevels as value, i}
            <span class="text-gray-400">
              Tier {i + 1}: {ethers.utils.formatUnits(
                value,
                tokenDecimals
              )}
              {#if parsedReport?.[i] == 0}
                ✅
              {:else if parsedReport?.[i] > 0}
                ❌
              {/if}
            </span>
          {/each}
        {/if}
      </div>
      {#if addressBalance}
        <span
          >{addressToReport} Balance: {ethers.utils.formatUnits(
            addressBalance,
            tokenDecimals
          )}
          {tokenSymbol}</span
        >
      {/if}
    </FormPanel>
  {:else if errorMsg}
    <span class="text-red-400">{errorMsg}</span>
  {:else if !params.wild}
    <FormPanel>
      <Input
        bind:value={balanceTierAddress}
        type="address"
        placeholder="Contract address"
        validator={addressValidate}
      />
      <Button
        on:click={() => {
          push(`/erc20balancetier/report/${balanceTierAddress}`);
        }}
      >
        Load
      </Button>
    </FormPanel>
  {/if}
</div> -->

<script lang="ts">
  import { client } from "$src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { ethers } from "ethers";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import { getERC20, tierReport } from "../../utils";
  import { push } from "svelte-spa-router";
  import { CombineTier } from "rain-sdk";
  import HumanReadable from "$components/FriendlySource/HumanReadable.svelte";
  import { queryStore } from "@urql/svelte";
  import { addressValidate, required } from "$src/validation";

  export let params: { wild: string },
    errorMsg: string,
    combineTierAddress: string,
    addressToReport: string,
    parsedReport: number[],
    combineTierContract,
    erc20,
    // erc20name,
    // erc20symbol,
    // erc20decimals,
    // erc20address,
    tierLevels;

  const tierValues = new Array(8);

  $: if (params.wild) {
    initContract();
  }

  $: tierLevels = [
    $combineTier?.data?.combineTier?.state?.constants[1].toString(16),
    $combineTier?.data?.combineTier?.state?.constants[2].toString(16),
    $combineTier?.data?.combineTier?.state?.constants[3].toString(16),
    $combineTier?.data?.combineTier?.state?.constants[4].toString(16),
    $combineTier?.data?.combineTier?.state?.constants[5].toString(16),
    $combineTier?.data?.combineTier?.state?.constants[6].toString(16),
    $combineTier?.data?.combineTier?.state?.constants[7].toString(16),
    $combineTier?.data?.combineTier?.state?.constants[8].toString(16),
  ]

  const initContract = async () => {
    if (ethers.utils.isAddress(params.wild || "")) {
      // setting up the combine tier contract

      combineTierContract = new CombineTier(params.wild, $signer);
      //erc20 = await getERC20($combineTier?.data?.combineTier?.address.toString(), $signer, $signerAddress)
    } else if (params.wild) {
      errorMsg = "Not a valid CombineTier address";
    }
  };

  $: erc20address = $combineTier?.data?.combineTier?.state?.constants[0] ? "0x" + BigInt($combineTier?.data?.combineTier?.state?.constants[0]).toString(16) : undefined;

  $: {
    (async() => {
      erc20 = await getERC20(erc20address, $signer, $signerAddress)
    })()
  }

  const report = async () => {
    if (ethers.utils.isAddress(addressToReport)) {
      const report = await combineTierContract.report(addressToReport, []);
      parsedReport = tierReport(report.toHexString());
      console.log($combineTier?.data?.combineTier?.state?.constants[1].toString())
      console.log(erc20)
      console.log($combineTier?.data?.combineTier?.address)
      // addressBalance = await erc20C.balanceOf(addressToReport);
    } else {
      errorMsg = "Not a valid Ethereum address";
    }
  };

  const reportMyAddress = () => {
    addressToReport = $signerAddress;
    report();
  };

  $: combineTier = queryStore({
    client: $client,
    query: `query ($address: Bytes) {
        combineTier (id: $address) {
          id
          address
          deployBlock
          deployTimestamp
          deployer
          state {
            sources
            constants
          }
        }
      }`,
    variables: { address: combineTierContract?.address.toLowerCase() },
  });

  $: FriendlySource = $combineTier?.data?.combineTier?.state;

  $: console.log(FriendlySource);
</script>

<div class="mb-2 flex flex-col gap-y-2">
  <span class="text-2xl"> Get a CombineTier report. </span>
  <span class="text-gray-400">
    CombineTier produces a report based on two or more other Tiers.
  </span>
  {#if !params.wild}
    <span class="text-gray-400">
      Enter a CombineTier contract address below, or <span
        class="cursor-pointer underline"
        on:click={() => {
          push("/combinetier/list");
        }}>browse all deployed CombineTier contracts.</span
      >
    </span>
  {/if}
</div>
<div class="flex w-full gap-x-3">
  <div class="flex w-3/5 flex-col gap-y-4">
    {#if erc20 && ethers.utils.isAddress(params.wild) && params.wild && !errorMsg}
      <!-- <FormPanel heading="Get a report on an address">
        <Input
          bind:value={addressToReport}
          type="text"
          placeholder="Enter an Ethereum address"
          validator={required}
        />
        <div class="flex flex-row gap-x-2">
          <Button shrink on:click={report}>Get a report</Button>
          <Button shrink on:click={reportMyAddress}>Report my address</Button>
        </div>
        {#if tierValues}
          <div class="flex flex-col gap-y-2">
            <span class="text-lg">Token values for this BalanceTier:</span>
            {#each tierValues as value, i}
              <span class="text-gray-400">
                Tier {i + 1}:
                {#if parsedReport?.[i] == 0}
                  ✅
                {:else if parsedReport?.[i] > 0}
                  ❌
                {/if}
              </span>
            {/each}
          </div>
        {/if}
      </FormPanel> -->
      <FormPanel heading="ERC20 used for this BalanceTier">
        <div class="mb-4 flex flex-col gap-y-2">
          <div class="flex flex-col text-gray-400">
            <span>Name: {erc20?.erc20name}</span>
            <span>Symbol: {erc20?.erc20symbol}</span>
            <span>Address: {erc20address}</span>
          </div>
        </div>
      </FormPanel>
      <FormPanel heading="Get a report on an address">
        <Input
          bind:value={addressToReport}
          type="text"
          placeholder="Enter an Ethereum address"
          validator={required}
        />
        <div class="flex flex-row gap-x-2">
          <Button shrink on:click={report}>Get a report</Button>
          <Button shrink on:click={reportMyAddress}>Report my address</Button>
        </div>
        <div class="flex flex-col gap-y-2">
          <span class="text-lg">Token values for this BalanceTier:</span>
          {#if erc20 && $combineTier?.data?.combineTier && tierLevels.length}
            {#each tierLevels as value, i}
              <span class="text-gray-400">
                Tier {i + 1}: {ethers.utils.formatUnits(
                  value,
                  erc20.erc20decimals
                )}
                {#if parsedReport?.[i] == 0}
                  ✅
                {:else if parsedReport?.[i] > 0}
                  ❌
                {/if}
              </span>
            {/each}
          {/if}
        </div>
        <!-- {#if addressBalance}
          <span
            >{addressToReport} Balance: {ethers.utils.formatUnits(
              addressBalance,
              tokenDecimals
            )}
            {tokenSymbol}</span
          >
        {/if} -->
      </FormPanel>
    {:else if errorMsg}
      <span class="text-red-400">{errorMsg}</span>
    {:else if !params.wild}
      <FormPanel>
        <Input
          bind:value={combineTierAddress}
          type="address"
          placeholder="Contract address"
          validator={addressValidate}
        />
        <Button
          on:click={() => {
            push(`/erc20balancetier/report/${combineTierAddress}`);
          }}
        >
          Load
        </Button>
      </FormPanel>
    {/if}
  </div>
  <div class="flex w-2/5 flex-col gap-y-4">
    {#if FriendlySource}
      <span class="sticky">
        <FormPanel heading="Human Readable Source">
          <HumanReadable
            signer={$signerAddress}
            contractType="any"
            {FriendlySource}
          />
        </FormPanel>
      </span>
    {/if}
  </div>
</div>

