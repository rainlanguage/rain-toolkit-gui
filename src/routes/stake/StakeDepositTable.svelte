<script lang="ts">
  import { formatAddress } from "$src/utils";
  import { queryStore } from "@urql/svelte";
  import { formatUnits } from "ethers/lib/utils";
  import { signerAddress } from "svelte-ethers-store";
  import { getContext } from "svelte";
  import IconLibrary from "$components/IconLibrary.svelte";
  import Switch from "$components/Switch.svelte";
  import { onMount } from "svelte/internal";
  import { client } from "$src/stores";

  const { open } = getContext("simple-modal");
  export let _stake, stakeContract;

  let checked = true;
  let signerBalance, decimals, symbol, temp;

  let stakeAddress = stakeContract
    ? stakeContract.address.toLowerCase()
    : undefined;
  let depositor = $signerAddress.toLowerCase();

  $: allDepositQuery = queryStore({
    client: $client,
    query: `
        query ($stakeAddress: Bytes!) {
          stakeDeposits(where: {stakeToken: $stakeAddress}) {
            depositor
            id
            stakeTokenMinted
            stakeToken {
              address
              decimals
              deployBlock
              deployTimestamp
              deployer
              tokenPoolSize
              stakeTokenToTokenRatio
              tokenToStakeTokenRatio
              totalSupply
              name
              symbol
              initialRatio
            }
          }
        }`,
    variables: { stakeAddress },
    requestPolicy: "network-only",
    pause: checked ? false : true,
  });

  $: myDepositQuery = queryStore({
    client: $client,
    query: `
        query ($stakeAddress: Bytes!, $depositor: Bytes!) {
          stakeDeposits(where: {stakeToken: $stakeAddress, depositor: $depositor}) {
            depositor
            id
            stakeTokenMinted
            stakeToken {
              address
              decimals
              deployBlock
              deployTimestamp
              deployer
              tokenPoolSize
              stakeTokenToTokenRatio
              tokenToStakeTokenRatio
              totalSupply
              name
              symbol
              initialRatio
            }
          }
        }`,
    variables: { stakeAddress, depositor },
    requestPolicy: "network-only",
    pause: !checked ? false : true,
  });

  $: txQuery = checked ? allDepositQuery : myDepositQuery;

  // handling table refresh
  const refresh = async () => {
    temp = stakeAddress;
    stakeAddress = undefined;
    if (await !$txQuery.fetching) {
      stakeAddress = temp;
    }
  };
</script>

<div class="flex w-full flex-col gap-y-4">
  <div class="flex flex-row justify-between">
    <span class="text-lg font-semibold">Stake Token Deposit History</span>

    <div class="flex flex-row items-center gap-x-4">
      <span class="text-sm"
        >Showing {#if !checked}only mine{:else}all transactions{/if}</span
      >
      <Switch bind:checked />
      <span
        class:animate-spin={$txQuery.fetching}
        class="flex flex-col justify-center"
        on:click={refresh}><IconLibrary icon="reload" /></span
      >
    </div>
  </div>

  {#if $txQuery.fetching}
    Loading transactions...
  {:else if $txQuery.error}
    Something went wrong.
  {:else if $txQuery?.data?.stakeDeposits.length}
    <table class="table-auto w-full space-y-2 text-sm">
      <tr class="border-b border-gray-600 uppercase text-sm">
        <th class="text-gray-400 text-left pb-2 font-light">Depositor</th>
        <th class="text-gray-400 text-left pb-2 font-light">Token Address</th>
        <th class="text-gray-400 text-left pb-2 font-light">Token Minted</th>
      </tr>
      {#each $txQuery.data.stakeDeposits as data}
        <tr>
          <td> {formatAddress(data.depositor)} </td>
          <td>
            {formatAddress(data.stakeToken.address)}
          </td>
          <td class="py-2">
            {Number(
              (+formatUnits(
                data.stakeTokenMinted,
                data.stakeToken.decimals
              )).toFixed(4)
            )}
            {data.stakeToken.symbol}
          </td>
        </tr>
      {/each}
    </table>
  {:else}
    You haven't made any transactions.
  {/if}
</div>
