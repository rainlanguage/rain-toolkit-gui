<script lang="ts">
    import { formatUnits } from 'ethers/lib/utils';
    import Button from '$components/Button.svelte';
    import Ring from '$components/Ring.svelte';
    import { signer, signerAddress } from "svelte-ethers-store";
    import { EmissionsERC20 } from "rain-sdk";
    import { ethers } from "ethers";
    import { formatAddress, formatAddressExtended } from '$src/utils';
    import Item from './Item.svelte';
    import Label from './Label.svelte';

    export let claimableContracts
    export let label
    export let claimable;
    let TokenAddress, claimPromise

    const claim = async (tokenAddress) => {
        let emissionsContract = ethers.utils.isAddress(tokenAddress) ? new EmissionsERC20(tokenAddress, $signer): null;
        TokenAddress = tokenAddress
        
        const tx = await emissionsContract.claim(
        $signerAddress,
        ethers.constants.AddressZero
        );
        return await tx.wait();
    };

</script>

<Item>
    <Label>{label}</Label>
    {#if $signer}
        {#if claimableContracts}
        {#await claimableContracts}
            loading...
        {:then tokens} 
        <div class="max-w-full font-mono break-words">              
          {#each tokens as token, i}
            {#if claimable}  
                {#if token?.claim?.toString() != '0' && token != undefined}
                    <div class="p-2 bg-gray-200 flex flex-row">
                        <div class="w-3/4 py-2">
                        {` ${token?.name}`}
                        <a
                            class="text-blue-400 underline"
                            href={`/#/token/${token.address}`}>
                            {`(${formatAddress(token.address)})`}
                        </a>
                        <span class="pt-1 flex">
                            <span>
                                {formatUnits(token.claim, token.decimals)}
                                {token.symbol}
                            </span>
                        </span>
                        </div>
                        <div class="w-1/4 self-center">
                            <Button
                                small ={true}
                                shrink
                                on:click={() => {
                                    claimPromise = claim(token.address);
                                }}>Claim
                            </Button>
                            <span style={`${TokenAddress == token.address ? "display : flex" : "display : none"}`}>
                                {#if claimPromise}
                                    {#await claimPromise}
                                        <div class="flex flex-row items-center gap-x-2" >
                                            <Ring color="#000" size={"20px"}/>
                                            <span>Claiming</span>
                                        </div>
                                    {:then}
                                        Claim complete!
                                    {/await}
                                {/if}
                            </span>
                        </div>
                    </div>
                {/if}
            {:else}
                {#if token?.claim?.toString() == '0' && token != undefined}
                    <div class="p-2 bg-gray-200 mr-5">
                    {`${token?.symbol}`}
                    <a
                    class="text-blue-400 underline"
                    href={`/#/token/${token.address}`}>
                        {`(${formatAddressExtended(token.address)})`}
                        </a>
                    </div>
                
                {/if}
            {/if}
          {/each}
        </div>
        {/await}
        {/if}
    {:else}
      Connect your wallet to view the claimable tokens
    {/if}
</Item>