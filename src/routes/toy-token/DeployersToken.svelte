<script lang="ts">
	import { client } from '../../stores';
  import { push } from "svelte-spa-router";
  import Section from '$routes/toy-token/Section.svelte';
  import SectionHeading from '$routes/toy-token/SectionHeading.svelte';
  import SectionBody from '$routes/toy-token/SectionBody.svelte';
  import Item from '$routes/toy-token/Item.svelte';
  import Label from '$routes/toy-token/Label.svelte';
  import Info from '$routes/toy-token/Info.svelte';
  import OtherTokens from '$routes/toy-token/OtherTokens.svelte';
  import { ethers } from "ethers";
  import { queryStore } from "@urql/svelte";
  import { onMount } from "svelte";
  import IconLibrary from '$components/IconLibrary.svelte';
  import { formatAddressExtended } from '$src/utils';
  import { signer, signerAddress } from "svelte-ethers-store";
  import { EmissionsERC20 } from "rain-sdk";
  import ClaimableContracts from './ClaimableContracts.svelte';

  export let params: {
    wild: string;
  };

  let deployer, claimableContracts, erroMsg= "";

  $: if (params.wild) {
    deployer = params.wild
    console.log("param", params.wild)
  }

  onMount(()=>{
    if(params.wild) deployer = params.wild
  })


    $: allTokens = queryStore({
    client: $client,

    query: `
          query ($deployer: Bytes!){
            emissionsERC20S(orderBy: deployTimestamp, orderDirection : desc, where: {deployer: $deployer}) {
              id
              address
              deployBlock
              deployTimestamp
              deployer
              name
              symbol
              totalSupply
              decimals
              }
          }`,
      variables: { deployer },
    requestPolicy: "network-only"
  });

  $: tokens = $allTokens?.data?.emissionsERC20S
  $: totalTokens = $allTokens?.data?.emissionsERC20S.length

  $: if($allTokens?.data?.emissionsERC20S){
      claimableContracts = Promise.all($allTokens?.data?.emissionsERC20S.map(async (element, index) => {
        
        let emissionsContract = ethers.utils.isAddress(element.address) ? new EmissionsERC20(element.address, $signer): null;  
        try{
        const claim = await emissionsContract.calculateClaim($signerAddress);

          element.claim = claim
          return element
        }catch(error){
          erroMsg = "Something wrong"
        } 
    }));
  }
  
</script>

<div class="flex gap-x-3 relative">
  <div class="flex w-2/3 flex-col gap-y-6 p-8">
    <div class="mb-2 flex flex-row justify-between gap-y-2 items-center">
      <span class="text-3xl">Deployers Deployed Tokens</span>
      <div>
        <IconLibrary icon="share" />
      </div>
    </div>

    {#if $allTokens.fetching}
        Loading...
    {:else if $allTokens.error}
        Something went wrong...
    {:else if $allTokens.data}
      <Section>
        <SectionHeading>Details</SectionHeading>
        <SectionBody direction="flex-row">
          <div class="w-5/12 space-y-4">
            <Item>
              <Label>Wallet</Label>
              <Info>{formatAddressExtended(deployer)}</Info>
            </Item>
            <Item>
              <Label>Number of contracts</Label>
              <Info>{totalTokens}</Info>
            </Item>
            <Item>
              <Label>First deployed</Label>
              <Info>{`${tokens[totalTokens -1].name}`}
                <a
                  class="text-blue-400 underline"
                  href={`/#/token/${tokens[totalTokens -1].address}`}>
                    {`(${formatAddressExtended(tokens[totalTokens -1].address)})`}
                </a>
              </Info>
            </Item>
            <Item>
              <Label>Last deployed</Label>
              <Info>{`${tokens[0].name}`}
                <a
                  class="text-blue-400 underline"
                  href={`/#/token/${tokens[0].address}`}>
                    {` (${formatAddressExtended(tokens[0].address)})`}
                </a>
              </Info>
            </Item>
            <div class="pt-2">
              <ClaimableContracts claimable={false} claimableContracts={claimableContracts} label="Contracts you are not eligible to claim from"/>
          </div>
          </div>
          <div class="w-7/12 space-y-4">
              <ClaimableContracts claimable={true} claimableContracts={claimableContracts} label="Contracts you are eligible to claim from"/>
          </div>
        </SectionBody>
      </Section>
    {/if}
  </div>

  <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400">
    <OtherTokens />
  </div>

</div>