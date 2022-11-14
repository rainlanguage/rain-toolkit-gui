<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import { push } from "svelte-spa-router";
    import { signer , signerAddress } from "svelte-ethers-store";
    import Ring from "$components/Ring.svelte";
    import {tokenAddressess } from "$src/constants"   

    import { client } from "$src/stores";
    import { queryStore , gql } from "@urql/svelte";

    export let params: {
        wild: string;
    }; 

    let ownerAddress
    let orders = [] 

    $: if($signer) {
            ownerAddress = $signerAddress?.toLowerCase()
        }

    $: sloshes = queryStore({
        client: $client,
        query: `
            query ($owner: Bytes!, $vaultId: BigInt!) { 

                tokenVaults(where: {owner: $owner , vaultId : $vaultId}){
                    orders(where : {orderLive : true}){
                        id
                    }
                }
            }`,
        variables: { owner : ownerAddress , vaultId : params.wild }
        
    });   

    $: if ($sloshes.data) {  
        let tokenVaultsArray = $sloshes.data.tokenVaults  
        console.log("tokenVaultsArray : " , tokenVaultsArray )  
        let orders_ = [] 
        for(let i = 0 ; i < tokenVaultsArray.length ; i++ ){   
            
            orders_ = orders_.concat(tokenVaultsArray[i].orders)
        } 
        // console.log("orders : " , orders ) 

        orders = orders_.map(e => {return e.id} ).filter(function(item,index ,arr){  return arr.indexOf(item) == index;  })

    }
    const addSlosh = () =>{
         push(`/addslosh/${params.wild}`)
    }

</script> 

<div class="flex items-center justify-center">
    <Section>
        <div class="py-4 px-4">
            {#if $sloshes.fetching}
                <div class="p-4">
                    <Ring color="#1D4ED8" />
                    <div>Loading...</div>
                </div>
            {:else if $sloshes.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-2 pt-2 ">
                    <div class="flex justify-between pb-6">
                        <span class="cursor-pointer" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span>
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold">Sloshes</span>
                            <!-- <span class="font-normal">(Ox2413fb3709b0...)</span> -->
                        </div>
                        <span />
                        <!-- <span on:click={() =>{push(`/sloshbalance`)}}><IconLibrary icon="forward" width={14} /></span> -->
                    </div>
                    <div class="px-10">
                        <div class="pb-10">
                            {#each orders as order}
                                <span class="flex flex-col leading-7 items-center underline hover:text-blue-500">
                                    <a href="/#/sloshbalance/{params.wild}/{order}">
                                        {order}
                                    </a>
                                </span>
                            {/each}
                        </div>

                        <div class="w-full flex px-6 justify-center">
                            {#if $signer}
                                <button class="bg-orange-400 w-full rounded-full text-base py-3 px-5 text-black" disabled={!$signer} on:click={addSlosh}>Add a Slosh</button>
                            {:else}  
                                <span class="">Please connect your wallet</span>
                            {/if}
                        </div> 
                    </div>
                    <div class="px-6 pt-4">
                        <div class="border-b border-gray-300" />
                        <div class="flex pt-2 justify-center text-center"><span>
                            Sloshes are the things that make the tokens <br />
                            move between each other.
                        </span></div>
                    </div>
                </div>
            {/if}
        </div>
    </Section>
</div> 