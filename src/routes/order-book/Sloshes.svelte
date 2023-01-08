<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import { push } from "svelte-spa-router";
    import { signer , signerAddress } from "svelte-ethers-store";
    import { ethers } from "ethers";
    import dayjs from "dayjs";

    import { client } from "$src/stores";
    import { queryStore , gql } from "@urql/svelte";
    import { max_uint256, ONE, hex_to_ascii  } from "./opcodes";
    import IconLibrary from "$components/IconLibrary.svelte";

    export let params: {
        wild: string;
    }; 

    let ownerAddress, temp
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
        variables: { owner : ownerAddress },
        requestPolicy: "network-only",
        
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

    const refresh = async () => {
        temp = ownerAddress;
        ownerAddress = undefined;
        if (await !$sloshes.fetching) {
            ownerAddress = temp;
        }
    };

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
                    <div class="grid grid-cols-3 grid-flow-col justify-between pb-6">
                        <div />
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold text-black mr-5">Sloshes</span>
                        </div>
                        <div>
                            <span  class="flex justify-end items-center pr-8 cursor-pointer" class:animate-spin={$sloshes.fetching} on:click={refresh}>
                                <IconLibrary color="text-black" icon="reload" /></span>
                        </div>
                    </div>
                    <div>
                        <table class="table-auto block w-full px-8 pb-2">
                            <thead class="block" style="width: 38rem;">
                                <tr class="font-semibold flex w-full">
                                    <th class="text-left pb-2 w-1/4 text-black">Name</th>
                                    <th class="text-left pb-2 w-1/4 text-black">Date Created</th>
                                    <th class="text-left pb-2 w-1/4 text-black">Slosh Balances</th>
                                    <th class="text-left pb-2 w-1/4 text-black">Slosh History</th>
                                </tr>  
                            </thead>
                            <tbody class="block font-normal" style="width: 38rem;">
                                {#each orders as order}
                                    <tr class={`${!order.orderLive ? 'text-red-500' : 'text-gray-700'} flex w-full`}>
                                        <td class={`w-1/4`}>{hex_to_ascii(order.data).isValid ? hex_to_ascii(order.data).asciiString : ""}</td>
                                        <td class={`w-1/4 `}>{dayjs.unix(order.timestamp).toISOString().slice(0,10)}</td>
                                        <td class={`py-1 w-1/4 underline hover:text-blue-500`}>
                                            <a href="/#/slosh/{order.id}" class="underline">
                                                Slosh Balance
                                            </a>
                                        </td>
                                        <td class={`py-1 w-1/4   underline hover:text-blue-500`}>
                                            <a href="/#/slosh-history/{order.id}" class="underline">
                                                Slosh History
                                            </a>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="px-10">
                        <div class="w-full flex px-2 justify-center">
                            {#if $signer}
                                <button class="w-full rounded-full text-base py-3 px-28 text-black font-medium" style="background-color: #FDA742;  box-shadow: inset 0px 2px 6px 0px #ffffff;" disabled={!$signer} on:click={addSlosh}>Add a Slosh</button>
                            {:else}  
                                <span class="">Please connect your wallet</span>
                            {/if}
                        </div> 
                    </div>
                    <div class="border-b pt-4 border-gray-300" />
                    <div class="px-6 ">
                        <div class="flex pt-1 justify-center text-center text-black"><span>
                            Sloshes are the smart contracts that make the tokens <br />
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