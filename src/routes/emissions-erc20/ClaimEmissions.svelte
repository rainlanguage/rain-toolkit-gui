<script lang="ts">
	import { client } from './../../stores';
  import { BigNumber, ethers } from "ethers";
  import { formatUnits } from "ethers/lib/utils";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { push } from "svelte-spa-router";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import TokenInfo from "../sale/TokenInfo.svelte";
  import { EmissionsERC20 } from "rain-sdk";
  import { addressValidate } from "$src/validation";
  import { onMount } from "svelte";
  import { gql } from "@urql/svelte";

  export let params: {
    wild: string;
  };

  let emissionsContract, token;
  let errorMsg, emissionsAddress;
  let showClaim;
  let initPromise, calcClaimPromise, claimPromise;

  $: if (params.wild) {
    initPromise = initContract();
    console.log(params.wild)
  }

  $: emissionsContract = ethers.utils.isAddress(params.wild || "") ? new EmissionsERC20(params.wild, $signer): null;

  const getQuery = async (contractAddress:string) => {
    const query = gql(`
        query ($contractAddress: Bytes!) {
          emissionsERC20 (id:$contractAddress) {
            id
            name
            symbol
            decimals
            totalSupply
          }
        }
      `)

      let token = (await $client.query(
          query, 
          {contractAddress: contractAddress.toLowerCase()},
          {requestPolicy: 'network-only'}
        ).toPromise()).data?.emissionsERC20

      token.totalSupply = BigNumber.from(token.totalSupply)
      return token
  }

  const initContract = async () => {
    if (ethers.utils.isAddress(params.wild || "")) {
      token = await getQuery(params.wild)
      console.log(token)
      if (!token) {
        errorMsg = "No token found on this network."
      }
    } else if (params.wild) {
      errorMsg = "Not a valid contract address";
    }
  };

  const calculateClaim = async () => {
    const claim = await emissionsContract.calculateClaim($signerAddress);
    showClaim = !showClaim;
    return claim;
  };

  const claim = async () => {
    const tx = await emissionsContract.claim(
      $signerAddress,
      ethers.constants.AddressZero
    );
    return await tx.wait();
  };

  onMount(()=>{
    if(params.wild) initPromise = initContract()
  })

  $: console.log(token)
</script>

<div class="flex w-full max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl">Claim emissions from a deployed EmissionsERC20</span>
  </div>

  {#if initPromise}
    {#await initPromise}
      Loading...
    {:then}
      {#if token}
        <FormPanel heading="Emissions Token">
          <TokenInfo
            tokenData={{
              name: token.name,
              symbol: token.symbol,
              decimals: token.decimals,
              id: token.id,
              totalSupply: token.totalSupply,
            }}
          />
        </FormPanel>

        <FormPanel heading="Claim">
          {#if !showClaim}
            <div class="flex flex-col gap-y-4">
              <span class="text-gray-400"
                >Calculate claim for {$signerAddress}</span
              >
              <Button
                on:click={() => {
                  calcClaimPromise = calculateClaim();
                }}
              >
                Calculate
              </Button>
            </div>
          {/if}
          {#if calcClaimPromise}
            <div>
              {#await calcClaimPromise}
                Getting eligible claim...
              {:then claim}
                Your claim will be {formatUnits(claim, token.erc20decimals)}
                {token.erc20symbol}
              {:catch err}
                <span class="text-lg text-red-400">{err.error.message}</span>
              {/await}
            </div>
          {/if}

          {#if showClaim}
            <Button
              shrink
              on:click={() => {
                claimPromise = claim();
              }}>Claim</Button
            >
            {#if claimPromise}
              {#await claimPromise}
                Claiming...
              {:then}
                Claim complete! Refresh to see your new balance.
              {/await}
            {/if}
          {/if}
        </FormPanel>
      {/if}
    {/await}
  {/if}
</div>
