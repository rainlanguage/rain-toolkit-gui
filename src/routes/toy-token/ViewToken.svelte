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
  import { EmissionsERC20, Formatter } from "rain-sdk";
  import { addressValidate } from "$src/validation";
  import { onMount } from "svelte";
  import { gql } from "@urql/svelte";
    import Section from '$routes/toy-token/Section.svelte';
    import SectionHeading from '$routes/toy-token/SectionHeading.svelte';
    import SectionBody from '$routes/toy-token/SectionBody.svelte';
    import Item from '$routes/toy-token/Item.svelte';
    import Label from '$routes/toy-token/Label.svelte';
    import Info from '$routes/toy-token/Info.svelte';
    import OtherTokens from '$routes/toy-token/OtherTokens.svelte';
    import IconLibrary from '$components/IconLibrary.svelte';
    import Ring from '$components/Ring.svelte';

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
            calculateClaimStateConfig {
              sources
              constants
            }
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

  $: if ($signer) calcClaimPromise = calculateClaim()

  $: console.log(token)
</script>

<div class="flex gap-x-3 relative">
  <div class="flex w-2/3 flex-col gap-y-6 p-8">
    <div class="mb-2 flex flex-row justify-between gap-y-2 items-center">
      <span class="text-3xl">Toy Token</span>
      <div>
        <IconLibrary icon="share" />
      </div>
    </div>

    {#if initPromise}
      {#await initPromise}
        Loading...
      {:then}
        {#if token}
        <Section>
          <SectionHeading>Token</SectionHeading>
          <SectionBody>
            <Item>
              <Label>Name</Label>
              <Info>{token.name}</Info>
            </Item>
            <Item>
              <Label>Symbol</Label>
              <Info>{token.symbol}</Info>
            </Item>
            <Item>
              <Label>Current Total Supply</Label>
              <Info>{formatUnits(token.totalSupply, token.decimals)}</Info>
            </Item>
          </SectionBody>
        </Section>

        <Section>
          <SectionHeading>Expressions (1)</SectionHeading>
          <SectionBody>
            <Item>
              <Label>Calculate claim expression</Label>
              <div class="font-mono bg-gray-200 p-4 rounded-lg">
                {Formatter.get(token.calculateClaimStateConfig)}
              </div>
            </Item>
          </SectionBody>
        </Section>

        <Section>
          <SectionHeading>Claim</SectionHeading>
          <SectionBody>
            {#if $signer}
              {#if calcClaimPromise}
              <Item>
                <Label>Preview claim amount</Label>
                <Info>
                  {#await calcClaimPromise}
                    Getting eligible claim...
                  {:then claim}
                  <div class="flex flex-row items-center gap-x-2">
                    <span>
                      {formatUnits(claim, token.decimals)}
                      {token.symbol}
                    </span>
                    <span
                      class="flex flex-row items-center"
                      on:click={() => {
                        calcClaimPromise = calculateClaim();
                      }}
                      >
                      <IconLibrary icon="reload" width={15}/>
                    </span>
                  </div>
                  {:catch err}
                    <span class="text-lg text-red-400">{err.error.message}</span>
                  {/await}
                </Info>
              </Item>
              {/if}

              <div class="self-start">
                <Button
                  shrink
                  on:click={() => {
                    claimPromise = claim();
                  }}>Claim</Button
                >
              </div>
              {#if claimPromise}
                {#await claimPromise}
                  <div class="flex flex-row items-center gap-x-2">
                    <Ring color="#000" size={"20px"}/>
                    <span>Claiming</span>
                  </div>
                {:then}
                  Claim complete!
                {/await}
              {/if}
          {:else}
                Connect your wallet to claim this token according to its expression.
          {/if}
        </SectionBody>
        </Section>
        {/if}
      {/await}
    {/if}
  </div>

  <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400">
    <OtherTokens />
  </div>

</div>
