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
  let withdrawer = $signerAddress.toLowerCase();

  $: allDepositQuery = queryStore({
    client: $client,
    query: `
        query ($stakeAddress: Bytes!) {
          stakeWithdraws(where: {stakeToken: $stakeAddress}) {
            id
            stakeTokenMinted
            withdrawer
            stakeToken {
              address
              decimals
              initialRatio
              stakeTokenToTokenRatio
              tokenToStakeTokenRatio
              tokenPoolSize
              totalSupply
              name
              symbol
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
        query ($stakeAddress: Bytes!, $withdrawer: Bytes!) {
          stakeWithdraws(where: {stakeToken: $stakeAddress, withdrawer: $withdrawer}) {
            id
            stakeTokenMinted
            withdrawer
            stakeToken {
              address
              decimals
              initialRatio
              stakeTokenToTokenRatio
              tokenToStakeTokenRatio
              tokenPoolSize
              totalSupply
              name
              symbol
            }
          }
        }`,
    variables: { stakeAddress, withdrawer },
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
    <span class="text-lg font-semibold">Stake Token Withdraw History</span>

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
  {:else if $txQuery?.data?.stakeWithdraws.length}
    <table class="table-auto w-full space-y-2 text-sm">
      <tr class="border-b border-gray-600 uppercase text-sm">
        <th class="text-gray-400 text-left pb-2 font-light">Withdrawer</th>
        <th class="text-gray-400 text-left pb-2 font-light">Token Address</th>
        <th class="text-gray-400 text-left pb-2 font-light">Token Minted</th>
      </tr>
      {#each $txQuery.data.stakeWithdraws as data}
        <tr>
          <td> {formatAddress(data.withdrawer)} </td>
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
