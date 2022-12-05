<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import { push } from "svelte-spa-router";
    import { signer , signerAddress } from "svelte-ethers-store";
    import Ring from "$components/Ring.svelte";
    import {tokenAddressess } from "$src/constants"   
    import { ethers } from "ethers";

    import { client } from "$src/stores";
    import { queryStore , gql } from "@urql/svelte";
    import { max_uint256, ONE  } from "./opcodes";

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

                tokenVaults(where: {owner: $owner , vaultId : $vaultId }){
                    orders(where: { orderLive : true , stateConfig_: {constants_contains: ["115792089237316195423570985008687907853269984665640564039457584007913129639935"]}}) {
                       id   
                       stateConfig{
                         constants
                         sources
                       }
                    }
               }  
            }`,
        variables: { owner : ownerAddress , vaultId : params.wild }
        
    });   

    $: if ($sloshes.data) {  
        let tokenVaultsArray = $sloshes.data.tokenVaults     

        const filterOrder = async () => {  


            let orders_ = []  

            for(let i = 0 ; i < tokenVaultsArray.length ; i++ ){   
                
                orders_ = orders_.concat(tokenVaultsArray[i].orders)
            } 
           
            let filteredArray = orders_.filter( (e) =>  { 
                if(e.stateConfig.constants.length == 2 && e.stateConfig.constants[0] == max_uint256.toString() && ethers.BigNumber.from(e.stateConfig.constants[1]).gte(ONE) ){                     
                    return true
                }
                    return false
               
            })
            orders = filteredArray.map(e => {return e.id} ).filter(function(item,index ,arr){  return arr.indexOf(item) == index;  })

        }
        filterOrder()

       

    }
    const addSlosh = () =>{
         push(`/addslosh/${params.wild}`)
    }

</script> 

<div class="flex items-center justify-center">
    <Section>
        <div class="pt-4 px-4">
            {#if $sloshes.fetching}
                <div class="p-4">
                    <Ring color="#1D4ED8" />
                    <div class=" text-black">Loading...</div>
                </div>
            {:else if $sloshes.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4 ">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-2 pt-2 ">
                    <div class="flex justify-between pb-6">
                        <span class="cursor-pointer  text-black" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span>
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold text-black mr-5">Sloshes</span>
                            <!-- <span class="font-normal">(Ox2413fb3709b0...)</span> -->
                        </div>
                        <span />
                        <!-- <span on:click={() =>{push(`/sloshbalance`)}}><IconLibrary icon="forward" width={14} /></span> -->
                    </div>
                    <div class="px-10">
                        <div class="pb-10 overflow-y-scroll max-h-72">
                            {#each orders as order}
                                <span class="flex flex-col leading-7 items-center underline hover:text-blue-500 text-black">
                                    <a href="/#/sloshbalance/{params.wild}/{order}">
                                        {order.substring(0,16)}...
                                    </a>
                                </span>
                            {/each}
                        </div>

                        <div class="w-full flex px-2 justify-center">
                            {#if $signer}
                                <button class="w-full rounded-full text-base py-3 px-28 text-black" style="background-color: #FDB142;" disabled={!$signer} on:click={addSlosh}>Add a Slosh</button>
                            {:else}  
                                <span class="">Please connect your wallet</span>
                            {/if}
                        </div> 
                    </div>
                    <div class="border-b pt-4 border-gray-300" />
                    <div class="px-6 ">
                        <div class="flex pt-1 justify-center text-center text-black"><span>
                            Sloshes are the things that make the tokens <br />
                            move between each other.
                        </span></div>
                    </div>
                </div>
            {/if}
        </div>
    </Section>
</div> 

<style>
    ::-webkit-scrollbar {
        width: 5px;
    }
</style>