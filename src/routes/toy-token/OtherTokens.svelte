<script lang="ts">
	import { client } from './../../stores';
  import { queryStore } from "@urql/svelte";
  import { Formatter } from 'rain-sdk';


    $: allTokens = queryStore({
    client: $client,

    query: `
          query{
            emissionsERC20S(orderBy: deployTimestamp, orderDirection : desc) {
              id
              address
              deployBlock
              deployTimestamp
              deployer
              name
              symbol
              totalSupply
              decimals
              claims{
                id
                sender
                data
                amount
              }
              calculateClaimStateConfig {
                id
                sources
                constants
              }
              }
          }`,
    requestPolicy: "network-only"
  });
</script>

<div class="border-t border-gray-400 h-full">
    <div class="border-b border-gray-400 p-2 w-full font-semibold">Other deployed tokens</div>
    <div class="flex flex-col overflow-scroll h-full">
        {#if $allTokens.data?.emissionsERC20S}
            {#each $allTokens?.data.emissionsERC20S as token}
            <div class="text-sm flex flex-col gap-y-1 p-2 border-b border-gray-300 w-full">
                <div>{token.name} ({token.symbol})</div>
                <div>
                    <span class="text-gray-500">Deployed: </span>
                    <span>{new Date(token.deployTimestamp * 1000).toLocaleString()}</span>
                </div>
                <div>
                    <span class="text-gray-500">Deployer: </span>
                    <span>{token.deployer}</span>
                </div>
                <div class="max-w-full font-mono p-2 bg-gray-200">{Formatter.get(token.calculateClaimStateConfig)}</div>
            </div>
            {/each}
        {/if}
    </div>
</div>