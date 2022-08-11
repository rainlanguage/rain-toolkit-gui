<script>
  import { push } from "svelte-spa-router";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import { queryStore } from "@urql/svelte";
  import { client } from "$src/stores";
  import dayjs from "dayjs";
  import { formatUnits } from "ethers/lib/utils";
  import { ethers } from "ethers";

  $: stakeERC20s = queryStore({
    client: $client,
    query: `
      query {
        stakeERC20S (orderBy: deployTimestamp, orderDirection:desc) {
          address
          deployer
          deployTimestamp
          id
          name
          decimals
          symbol
          initialRatio
          deployTimestamp
          token {
            decimals
            id
            name
            symbol
          }
          tokenPoolSize
          holders {
            id
          }
        }
      }`,
  });
</script>

{#if $stakeERC20s.fetching}
  Loading...
{:else if $stakeERC20s.error}
  <span class="text-red-400"
    >Something went wrong, try refreshing the page.</span
  >
{:else}
  <div class="flex flex-col gap-y-3">
    {#each $stakeERC20s.data.stakeERC20S as stake}
      <FormPanel>
        <div class="flex flex-col gap-y-2 mb-4">
          <span class="text-white">Stake details</span>
          <div class="text-gray-400 flex flex-col">
            <span>Contract Address: {stake.id}</span>
            <span>Deployer: {stake.deployer}</span>
            <span>Deployed: {dayjs.unix(stake.deployTimestamp).toString()}</span
            >
            <span>Name: {stake?.name}</span>
            <span>Symbol: {stake?.symbol}</span>
            <span
              >Total pool size: {formatUnits(
                stake?.tokenPoolSize,
                ethers.BigNumber.from(stake?.token.decimals)
              )}</span
            >
            <span>Stake token holders: {stake?.holders.length}</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-2 mb-4">
          <span class="text-white">ERC20 Token details</span>
          <div class="text-gray-400 flex flex-col">
            <span>Name: {stake?.token.name}</span>
            <span>Symbol: {stake?.token?.symbol}</span>
            <span>Address: {stake?.token?.id}</span>
          </div>
        </div>
        <div class="flex flex-row gap-x-2">
          <Button
            on:click={() => {
              push(`/stake/stake/${stake.address}`);
            }}>Stake</Button
          >
          <Button
            on:click={() => {
              push(`/stake/report/${stake.address}`);
            }}>Report</Button
          >
        </div>
      </FormPanel>
    {/each}
  </div>
{/if}
