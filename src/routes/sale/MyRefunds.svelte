<script lang="ts">
  import dayjs from "dayjs";
  import { operationStore, query } from "@urql/svelte";
  import { formatUnits } from "ethers/lib/utils";
  import { BLOCK_EXPLORER } from "../../constants";
  import IconLibrary from "components/IconLibrary.svelte";

  export let saleContract;

  let saleAddress;

  const buysQuery = operationStore(
    `
query ($saleAddress: Bytes!) {
  sales (where: {id: $saleAddress}) {
    deployer
    token {
      symbol
      name
      decimals
    }
    reserve {
      symbol
      name
      decimals
    }
    refunds {
      timestamp
      transactionHash
      id
      receipt {
        units
        price
        fee
      }
      fee
      totalOut
    }
    saleStatus
  }
}
`,
    {
      saleAddress,
    },
    {
      requestPolicy: "network-only",
    }
  );

  $buysQuery.variables.saleAddress = saleContract.address.toLowerCase();
  query(buysQuery);

  $: reserve = $buysQuery.data?.sales[0].reserve;
  $: token = $buysQuery.data?.sales[0].token;
</script>

<div class="flex w-full flex-col gap-y-4">
  <span class="text-lg font-semibold">Your refunds</span>
  {#if $buysQuery.fetching}
    Loading refunds...
  {:else if $buysQuery.error}
    Something went wrong.
  {:else if $buysQuery.data}
    <table class="table-auto w-full space-y-2">
      <tr class="border-b border-gray-600 uppercase text-sm">
        <th class="text-gray-400 text-left pb-2 font-light">Time</th>
        <th class="text-gray-400 text-left pb-2 font-light">Refunded</th>
        <th class="text-gray-400 text-left pb-2 font-light">Price/rTKN</th>
        <th class="text-gray-400 text-left pb-2 font-light">Fee</th>
        <th class="text-gray-400 text-left pb-2 font-light">Total</th>
        <th />
      </tr>
      {#each $buysQuery.data.sales[0].refunds as refund}
        <tr>
          <td class="py-2">
            {dayjs.unix(refund.timestamp).format("DD/MM/YYYY hh:mm:ss")}
          </td>
          <td class="py-2">
            {formatUnits(refund.receipt.units, token.decimals)}
            {token.symbol}
          </td>
          <td>
            {formatUnits(refund.receipt.price, reserve.decimals)}
            {reserve.symbol}
          </td>
          <td>{formatUnits(refund.fee, reserve.decimals)} {reserve.symbol}</td>
          <td>
            {formatUnits(refund.totalOut, reserve.decimals)}
            {reserve.symbol}
          </td>
          <td class="w-36 text-right">
            <a
              href={`${BLOCK_EXPLORER}/tx/${refund.transactionHash}`}
              target="_blank"
            >
              <IconLibrary icon="link" color="font-gray-100" width="10" />
            </a>
          </td>
        </tr>
      {/each}
    </table>
  {/if}
</div>