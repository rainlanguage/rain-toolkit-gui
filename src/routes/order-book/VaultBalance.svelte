<script lang="ts">
    import Button from "$components/Button.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import Section from "$routes/order-book/Section.svelte";
    import SloshBalance from "./SloshBalance.svelte"; 
    import erc20ABI from "./erc20ABI.json" 

    import { client } from "$src/stores";
    import { queryStore , gql } from "@urql/svelte"; 
    import { signer , signerAddress } from "svelte-ethers-store"; 
    import { BigNumber, ethers } from "ethers"; 

    import orderABI from "./orderbookABI.json" 

    import { eighteenZeros   } from './opcodes.ts'
    import { Token } from "graphql";
    import { id } from "ethers/lib/utils";
    import Ring from "$components/Ring.svelte";
    import { getContext } from "svelte";
    import DepositModal from "./DepositModal.svelte";
    import WithdrawModal from "./WithdrawModal.svelte";
    const { open } = getContext("simple-modal");


    export let params: {
        wild: string;
    }; 
    let threshold : number = 2   
    let orderBookContract

    let ownerAddress
    let vault  
    let orders = []

    $: if($signer) {
         ownerAddress = $signerAddress?.toLowerCase() 
        orderBookContract = new ethers.Contract('0x1d4e06f86d0d07059a4fc76069c1d8660558947e',orderABI , $signer )

    }

    $: Vault = queryStore({
        client: $client,
        query: `
            query ($owner: Bytes! , $id: BigInt! ) { 

                tokenVaults(where: {owner: $owner , vaultId : $id}){
                    vaultId  
                    token{ 
                        id
                        name  
                        decimals
                        symbol
                    } 
                    balance
                    orders(where : {orderLive : true}){
                        id
                    }
                }                     
            }`,
        variables: { owner : ownerAddress , id : params.wild   }
        
    });   

    $: if ($Vault.data ) { 
        // vaultIds = data.tokenVaults.map(e => {return e.vaultId} ).filter(function(item,index ,arr){  return arr.indexOf(item) == index;  })  
        vault = $Vault.data.tokenVaults
        console.log(vault)  
        let orders_ = [] 
        for(let i = 0 ; i < vault.length ; i++ ){   
            vault[i].balance = ethers.utils.formatUnits(BigNumber.from(vault[i].balance) , vault[i].token.decimals)
            orders_ = orders_.concat(vault[i].orders)
        }  

        orders = orders_.map(e => {return e.id} ).filter(function(item,index ,arr){  return arr.indexOf(item) == index;  })

    }  
    
</script> 

<div class="flex flex-col items-center justify-center ">
    <Section>
        <div class="py-4 px-4">
            {#if $Vault.fetching}
            <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>
                <!-- <div class="p-4">
                    <Ring color="#1D4ED8" />
                    <div>Loading...</div>
                </div> -->
            {:else if $Vault.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                    <div class="flex justify-between">
                        <span class="cursor-pointer text-black" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span>
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold text-black mr-5">Vault Balances</span>
                            <span class="font-normal text-gray-700 mr-5">({vault[0].vaultId})</span>
                        </div>
                        <div />
                    </div>
                    <div>
                        <table class="table-auto block w-full">
                            <tr class="font-semibold w-full">
                                <th class="text-left pb-2 w-52 text-black">Token</th>
                                <th class="text-left pb-2 w-52 text-black">Vault Balances</th>
                                <th class="w-52"/>
                            </tr>  
                            <tbody class=" w-full inline-block">
                            <!-- <tbody class=" max-h-40 w-full inline-block"> -->
                                {#each vault as vault_}
                                    <tr class="gap-x-4 flex w-full items-center">
                                        <td class="pr-6 w-1/4 text-gray-700">{vault_.token.name}</td>
                                        <td class="pr-6 flex justify-center text-gray-700" style="width: 38%;">{vault_.balance}</td>
                                        <td class="py-1" style="width: 37%;">
                                            <div class="flex justify-between">
                                                <div>
                                                    <button class="transition-colors text-sm leading-none py-1 px-5 rounded-full text-black" style="background-color: #FDB142;" on:click={() => {
                                                        open(WithdrawModal, {vault_, orderBookContract})
                                                        // withdraw(vault_.token.id)
                                                    }}>Withdraw</button>
                                                </div>
                                                <div><button class="transition-colors text-sm leading-none py-1 px-5 rounded-full text-black" style="background-color: #FDB142;" on:click={() => {
                                                    open(DepositModal, {vault_, orderBookContract})
                                                }}>Deposit</button></div>
                                                    <!-- // deposit(vault_.token.id) -->
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                            
                        </table>
                    </div>
                </div>
                <div class="flex flex-col justify-center items-center pt-6 gap-y-2">
                    <div class="font-semibold text-black">Sloshes</div>
                    <ul class="list-none"> 
                    <!-- <ul class="list-none  max-h-36">  -->
                        {#each orders as order}
                            <li class="leading-8 text-gray-700"> 
                                <a class="items-center underline hover:text-blue-500" href="/#/sloshbalance/{vault[0].vaultId}/{order}">
                                    {order.substring(0,20)}...
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    </Section>
    <!-- <div class="pt-6 pb-4 flex justify-center">
        <span class="font-semibold text-lg italic">How’s the liquidity. So much liquidity.</span>
    </div> -->
</div> 