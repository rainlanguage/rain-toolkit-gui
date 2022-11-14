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
        orderBookContract = new ethers.Contract('0x75b4A6c9238A5206adBa189221B90ebbFe4ac248',orderABI , $signer )

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

        console.log("orders : " , orders )

    } 

    const withdraw = async (tokenAddress) => {   
        const amount = ethers.BigNumber.from("10" + eighteenZeros); //to be taken input
        let vaultId = ethers.BigNumber.from(vault[0].vaultId);   

        const withdrawConfigStruct = {
            token: tokenAddress ,
            vaultId: vaultId,
            amount: amount
        }; 
        const txDepositOrderAlice = await orderBookContract.withdraw(withdrawConfigStruct); 
        await txDepositOrderAlice.wait()
    }
    
</script> 

<div class="flex flex-col items-center justify-center">
    <Section>
        <div class="py-4 px-4">
            {#if $Vault.fetching}
                <div class="p-4">
                    <Ring color="#1D4ED8" />
                    <div>Loading...</div>
                </div>
            {:else if $Vault.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                    <div class="flex justify-between">
                        <span class="cursor-pointer" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span>
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold">Vault Balances</span>
                            <span class="font-normal">({vault[0].vaultId})</span>
                        </div>
                        <div />
                    </div>
                    <div>
                        <table class="table-fixed">
                            <tr class="font-semibold ">
                            <th class="text-left pb-2 w-52">Token</th>
                            <th class="text-left pb-2 w-52">Vault Balances</th>
                            <th class="w-52"/>
                            </tr>  

                            {#each vault as vault_}
                            <tr class="gap-x-4">
                                <td class="pr-6">{vault_.token.name}</td>
                                <td class="pr-6">{vault_.balance}</td>
                                <td class="py-2">
                                    <div class="flex justify-between">
                                        <div>
                                            <Button small bRadius="rounded-full" variant="bg-orange-400" on:click={() => {
                                                open(WithdrawModal, {vault_, orderBookContract})
                                                // withdraw(vault_.token.id)
                                            }}>Withdraw</Button>
                                        </div>
                                        <div><Button small bRadius="rounded-full" variant="bg-orange-400" on:click={() => {
                                            open(DepositModal, {vault_, orderBookContract})
                                        }}>Deposit</Button></div>
                                            <!-- // deposit(vault_.token.id) -->
                                    </div>
                                </td>
                            </tr> 
                            {/each}

                            
                        </table>
                    </div>
                </div>
                <div class="flex flex-col justify-center items-center pt-6 gap-y-2">
                    <div class="font-semibold">Sloshes</div>
                    <ul class="list-none "> 
                        {#each orders as order}
                        <li class="leading-8"> <a class="items-center underline hover:text-blue-500" href="/#/sloshbalance/{vault[0].vaultId}/{order}">{order}</a></li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    </Section>
    <div class="pt-6 pb-4 flex justify-center">
        <span class="font-semibold text-lg italic">How’s the liquidity. So much liquidity.</span>
    </div>
</div> 