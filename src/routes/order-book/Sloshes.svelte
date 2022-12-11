<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import { push } from "svelte-spa-router";
    import { signer , signerAddress } from "svelte-ethers-store";
    import Ring from "$components/Ring.svelte";
    import {tokenAddressess } from "$src/constants"   
    import { ethers } from "ethers";
    import dayjs from "dayjs";

    import { client } from "$src/stores";
    import { queryStore , gql } from "@urql/svelte";
    import { max_uint256, ONE, hex_to_ascii  } from "./opcodes";

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
            query ($owner: Bytes!) { 
                orders(orderDirection: desc, orderBy: timestamp, where : {owner : $owner}){ 
                    data
                    id
                    timestamp
                    orderLive
                    stateConfig{
                        constants
                        sources
                    }
                }
            }`,
        variables: { owner : ownerAddress }
        
    });    

    $: if ($sloshes.data) {  
        let orders_ = $sloshes.data.orders   

        const filterOrder = async () => {   
           
            let filteredArray = orders_.filter( (e) =>  { 
                if(e.stateConfig.constants.length == 2 && e.stateConfig.constants[0] == max_uint256.toString() && ethers.BigNumber.from(e.stateConfig.constants[1]).gte(ONE) ){                     
                    return true
                }
                    return false  
            })
            orders = filteredArray
            

        }
        filterOrder()

    }
    const addSlosh = () =>{
         push(`/addslosh`)
    }

</script> 

<div class="flex items-center justify-center">
    <Section>
        <div class="pt-4 px-4">
            {#if $sloshes.fetching}
            <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>
                <!-- <div class="p-4">
                    <Ring color="#1D4ED8" />
                    <div class=" text-black">Loading...</div>
                </div> -->
            {:else if $sloshes.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4 ">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-2 pt-2 ">
                    <div class="flex justify-between pb-6">
                        <div />
                        <!-- <span class="cursor-pointer  text-black" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span> -->
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold text-black mr-5">Sloshes</span>
                            <!-- <span class="font-normal">(Ox2413fb3709b0...)</span> -->
                        </div>
                        <span />
                    </div>
                    <div>
                        <table class="table-auto block w-full px-8 pb-2">
                            <thead class="block" style="width: 32rem;">
                            <tr class="font-semibold flex w-full">
                                <th class="text-left pb-2 w-1/3 text-black">Name</th>
                                <th class="text-left pb-2 w-1/3 text-black">Date Created</th>
                                <th class="text-left pb-2 w-1/3 text-black">Slosh ID</th>
                            </tr>  
                        </thead>
                        <tbody class="block" style="width: 32rem;">
                            {#each orders as order}
                                <tr class={` flex w-full`}>
                                    <td class={`w-1/3  ${!order.orderLive ? 'text-red-500' : 'text-gray-700'} `}>{hex_to_ascii(order.data)}</td>
                                    <td class={`w-1/3  text-gray-700`}>{dayjs.unix(order.timestamp).toISOString().slice(0,10)}</td>
                                    <td class={`py-1 w-1/3 ${!order.orderLive ? 'text-red-500' : 'text-gray-700'}  underline hover:text-blue-500`}>
                                        <a href="/#/sloshbalance/{order.id}">
                                            {order.id.substring(0,16)}...
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                        </table>
                    </div>
                    <div class="px-10">
                        <!--<div class="pb-10">
                            {#each orders as order}
                                <span class="flex flex-col leading-7 items-center underline hover:text-blue-500 text-black">
                                    <a href="/#/sloshbalance/{params.wild}/{order}">
                                        {order.substring(0,16)}...
                                    </a>
                                </span>
                            {/each}
                        </div> -->

                        <div class="w-full flex px-2 justify-center">
                            {#if $signer}
                                <button class="w-full rounded-full text-base py-3 px-28 text-black" style="background-color: #FDB142;  box-shadow: inset 0px 2px 6px 0px #ffffff;" disabled={!$signer} on:click={addSlosh}>Add a Slosh</button>
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