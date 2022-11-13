<script lang="ts">
    import Button from "$components/Button.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import Section from "$routes/order-book/Section.svelte";  

    import { client } from "$src/stores";
    import { queryStore , gql } from "@urql/svelte"; 
    import { signer , signerAddress } from "svelte-ethers-store";
    import { BigNumber, ethers } from "ethers";
    import Ring from "$components/Ring.svelte";

    export let params: {
        wild: string;
    };   

    let vaultId = params.wild.split('/')[0]
    let sloshId = params.wild.split('/')[1]

    let ownerAddress
    let tokenArray = []
    let threshold : number = 2  

    let takeOrders_  = []

    $: getOrder = queryStore({
        client: $client,
        query: `
            query ($id: Bytes!) { 
                orders(where : {id : $id}){
                    validInputs{
                        tokenVault{ 
                            token{
                                name
                            } 
                        }
                    } 
                    validOutputs{
                        tokenVault{ 
                            token{
                                 name          
                            }
                        }
                    }
                } 
   
            }`,
        variables: {  id : sloshId }
        
    });   
    
    $: takeOrders = queryStore({
        client: $client,
        query: `
            query ($id: Bytes!) { 
                takeOrderEntities(where: {order: $id}) {
                    id
                    input
                    output
                    order {
                        id
                    }
                    inputToken {
                        id 
                        decimals 
                        name
                    }
                    outputToken {
                        id 
                        decimals 
                        name
                    }
                    inputIOIndex
                    outputIOIndex 
                    transactionHash
                } 
            }`,
        variables: {  id : params.wild }
    });  
    
    $: if ($getOrder.data && $signerAddress ) {  
        let order_ = $getOrder.data.orders   

        console.log("order_ : " , order_)
        let inputArray = order_[0].validInputs  
    
        for(let i = 0 ; i <inputArray.length ; i++ ){ 
            console.log(inputArray[i].tokenVault.token.name)
            tokenArray.push(inputArray[i].tokenVault.token.name)
        } 

        console.log("tokenArray : " , tokenArray ) 
    } 

    $: if ($takeOrders.data && $signerAddress ) {  

        takeOrders_ = $takeOrders.data.takeOrderEntities
  
        for(let i = 0 ; i < takeOrders_.length ; i++){
            takeOrders_[i].input = ethers.utils.formatUnits(BigNumber.from(takeOrders_[i].input) , takeOrders_[i].inputToken.decimals) 
            takeOrders_[i].output = ethers.utils.formatUnits(BigNumber.from(takeOrders_[i].output) , takeOrders_[i].outputToken.decimals)
        }

         console.log("takeOrders_ : " , takeOrders_ )   
     }

    $: if($signer) {
            ownerAddress = $signerAddress?.toLowerCase()
        }

    const handleClick = () =>{}
</script> 

<div class="flex flex-col items-center justify-center">
    <Section>
        <div class="py-4">
            {#if $getOrder.fetching}
                <div class="p-8">
                    <Ring color="#1D4ED8" />
                    <div>Loading...</div>
                </div>
            {:else if $getOrder.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                    <div class="flex justify-between">
                        <span class="cursor-pointer pl-8" on:click={() =>{history.back()}} ><IconLibrary icon="back" width={14} /></span>
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold">Slosh Balances</span>
                            <span class="font-normal">({sloshId.substring(0,20)}...)</span>
                        </div>
                        <div />
                        <!-- <span on:click={() =>{push(`/vaultbalance`)}} class="pl-8"><IconLibrary icon="back" width={14} /></span> -->
                    </div>
                    <div>
                        <div class="flex flex-col justify-center items-center pb-4">
                            <div class="font-semibold">Token</div>
                            <ul class="list-none "> 
                                {#if tokenArray} 
                                    {#each tokenArray as token}
                                        <li>{token}</li>
                                    {/each}
                                {/if}
                                
                            </ul>
                        </div>
                        <div class="pl-8">Vault: <a class="items-center underline hover:text-blue-500" href="/#/vaultbalance/{vaultId}">{vaultId.substring(0,15)}</a></div>
                    </div>
                </div>
                <div class="w-full bg-gray-300 p-2  gap-x-4 px-6 my-4">
                    <div class="w-full text-sm flex justify-center items-center">Threshold : {threshold} %</div>
                </div>
                <div class="grid grid-cols-3 px-14 gap-x-6">
                    <div class="flex flex-col gap-y-2">
                        <span class="font-semibold">History</span>
                        <ul class="list-none"> 

                            {#each takeOrders_ as takeOrder_}
                            <li class="leading-7">{takeOrder_.transactionHash.substring(0,12)}...</li>
                            {/each}
                            
                        </ul>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <span class="font-semibold">What was sold</span>
                        <ul class="list-none"> 
                            {#each takeOrders_ as takeOrder_}
                            <li class="leading-7">{takeOrder_.outputToken.name}  {takeOrder_.output}</li>
                            {/each}
                            
                        </ul>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <span class="font-semibold">What was bought</span>
                        <ul class="list-none">
                            {#each takeOrders_ as takeOrder_}
                            <li class="leading-7">{takeOrder_.inputToken.name}  {takeOrder_.input}</li>
                            {/each}
                        </ul>
                    </div>
            
                </div>
                <span class="grid justify-end px-6 pt-8">
                    <Button on:click={handleClick}>Deactivate Slosh</Button>
                </span>
            {/if}
        </div>
    </Section>
    <div class="pt-6 pb-4 flex justify-center">
        <span class="font-semibold text-lg italic">How’s the liquidity. So much liquidity.</span>
    </div>
</div>