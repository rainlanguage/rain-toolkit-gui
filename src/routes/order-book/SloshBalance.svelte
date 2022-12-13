<script lang="ts">
    import Button from "$components/Button.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import Section from "$routes/order-book/Section.svelte";
    import { selectedNetwork } from "$src/stores";  

    import { client } from "$src/stores";
    import { queryStore } from "@urql/svelte"; 
    import { provider , signer , signerAddress } from "svelte-ethers-store";
    import { BigNumber, ethers } from "ethers"; 
    import orderABI from "./orderbookABI.json" 
    import DepositModal from "./DepositModal.svelte";
    import WithdrawModal from "./WithdrawModal.svelte";
    import { getContext } from "svelte";
    import { hex_to_ascii } from "./opcodes";
    import {BigNumber as FloatBigNum} from 'bignumber.js'
    const { open } = getContext("simple-modal");
    import * as Sentry from "@sentry/svelte";
    import { Logger } from "ethers/lib/utils";
    import { push } from "svelte-spa-router"; 



    enum TxStatus {
        None,
        AwaitingConfirmation,
        Error,
    }

    export let params: {
        wild: string;
    };     
    
    let orderBookContract

    $: if($signer){
        orderBookContract = new ethers.Contract('0x1d4e06f86d0d07059a4fc76069c1d8660558947e',orderABI , $signer )
    }

    let txStatus = TxStatus.None, errorMsg;
    let sloshId = params.wild
    let vault = []
    let tokenVault
    let ownerAddress
    let tokenArray = []
    let threshold  

    let takeOrders_  = []

    $: getOrder = queryStore({
        client: $client,
        query: `
            query ($id: Bytes!) { 
                 
                order(id: $id){ 
                    data
                    id
                    timestamp
                    orderLive
                    interpreter 
                    dispatch
    				handleIODispatch
                    transactionHash
                    owner
                    stateConfig{
                        constants
                    }
                    validInputs{
                        tokenVault{  
                            vaultId
                            token{
                                id
                                name
                                decimals
                                symbol
                            } 
                            balance
                        }
                    } 
                    validOutputs{
                        tokenVault{ 
                            token{
                                name          
                            }
                            balance
                        }
                    }
                } 
   
            }`,
        variables: { id : sloshId }
        
    });   
    
    $: takeOrders = queryStore({
        client: $client,
        query: `
            query ($id: Bytes!) { 
                takeOrderEntities(where: {order_: {id :$id }}) {
                    id
                    input
                    output
                    order {
                        id
                        orderLive
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
                } 
            }`,
        variables: { id : sloshId }
    });  

    $: order = $getOrder?.data?.order;

    $: if ($getOrder.data != undefined && $signerAddress ) {  
        let order_ = $getOrder.data.order     

        let ratio = new FloatBigNum(order_.stateConfig.constants[1]) 
        let ONE = new FloatBigNum("1000000000000000000")   
        let HUNDRED = new FloatBigNum("100")   
        threshold = (ratio.minus(ONE)).times(HUNDRED).dividedBy(ONE)   


        let inputArray = order_?.validInputs  
    
        for(let i = 0 ; i <inputArray?.length ; i++ ){ 

            tokenArray.push(inputArray[i]?.tokenVault?.token?.name)
        } 

    } 

    $: if ($takeOrders.data && $signerAddress ) {  
        takeOrders_ = $takeOrders.data.takeOrderEntities 

        for(let i = 0 ; i < takeOrders_.length ; i++){
            takeOrders_[i].input = ethers.utils.formatUnits(BigNumber.from(takeOrders_[i].input) , takeOrders_[i].outputToken.decimals) 
            takeOrders_[i].output = ethers.utils.formatUnits(BigNumber.from(takeOrders_[i].output) , takeOrders_[i].inputToken.decimals)
        }
     }

    $: if($signer) {
            ownerAddress = $signerAddress?.toLowerCase()
        }

    const handleClick = async () =>{  
        try {
            let order_ = $getOrder.data.order 

            let tx  = await $provider.getTransactionReceipt(order_.transactionHash)  
            let byteData = tx.logs.filter(e => {return e.topics[0] == '0x7e4a3d1b8b320d979824450641b0d97507684bf55eafb4503032f4042f8fbf8d' })  

            let data = await ethers.utils.defaultAbiCoder.decode([
                "address","tuple(address,address,uint256,uint256,tuple(address,uint8,uint256)[],tuple(address,uint8,uint256)[],bytes)","uint256"] ,
                    byteData[0].data)   

            let IO = data[1][4].map(e => { 
                let vaultId = e[2].toString() 
                return{
                    token : e[0] ,
                    decimals : e[1] ,
                    vaultId : vaultId ,
                }
            })

            let deleteOrderConfig  = { 
                owner : order_.owner , 
                interpreter:  order_.interpreter,
                dispatch:order_.dispatch ,
                handleIODispatch:order_.handleIODispatch ,
                validInputs: IO,
                validOutputs: IO ,
                data : order_.data
            }  

            const txAskRemoveOrder = await orderBookContract.removeOrder(deleteOrderConfig);  
            txStatus = TxStatus.AwaitingConfirmation;

            let receipt = await txAskRemoveOrder.wait()   

            txStatus = TxStatus.None;
            push(`/sloshes`)
            
        } catch (error) {   
            
             Sentry.captureException(error);
            if (error.code === Logger.errors.TRANSACTION_REPLACED) {
                if (error.cancelled) {
                    errorMsg = "Transaction Cancelled";
                    txStatus = TxStatus.Error;
                    return;
                } else {
                    await error.replacement.wait();
                }
            } else if(error.code === -32603){
                errorMsg = 'Transaction Underpriced , please try again'
                txStatus = TxStatus.Error;
                return;
            }else if(error.code == Logger.errors.ACTION_REJECTED){
                errorMsg = 'Transaction Rejected'
                txStatus = TxStatus.Error;
                return;
            }else { 
                errorMsg = error.error?.data?.message  ||
                error.error?.message ||
                error.data?.message ||
                error?.message || 
                error?.code 
                txStatus = TxStatus.Error;
                return;
            }
        }      
    } 

</script> 

<div class="flex flex-col items-center justify-center"> 
    {#if txStatus == TxStatus.None}
    <Section>
        <div class="py-4">
            {#if $getOrder.fetching}
            <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>
            {:else if $getOrder.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                    <div class="flex justify-between">
                        <span class="cursor-pointer pl-8 text-black" on:click={() =>{history.back()}} ><IconLibrary icon="back" width={14} /></span>
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold text-black mr-5">Slosh {#if !order.orderLive} <span class="text-red-500">(deactivated)</span> {/if}</span>
                            <span class="font-normal text-gray-700 mr-5">{hex_to_ascii(order.data)} - {sloshId.substring(0,20)}...</span>
                        </div>
                        <div />
                    </div>
                    <div>
                        <table class="table-auto block w-full px-8 pb-2">
                            <tr class="font-semibold w-full">
                                <th class="text-left pb-2 w-52 text-black">Token</th>
                                <th class="text-left pb-2 w-52 text-black">Vault Balances</th>
                                <th class="w-52"/>
                            </tr>  
                            <tbody class=" w-full inline-block">
                            <!-- <tbody class=" max-h-40 w-full inline-block"> -->
                                {#each order.validInputs as token}
                                <tr class="gap-x-4 flex w-full items-center">
                                    <td class="pr-6 w-1/4 text-gray-700">{token?.tokenVault?.token?.name}</td>
                                    <td class="pr-6 flex justify-center text-gray-700" style="width: 38%;">{ethers.utils.formatUnits(token?.tokenVault?.balance , token?.tokenVault?.token?.decimals)}</td>
                                    <td class="py-1" style="width: 37%;">
                                        <div class="flex justify-between">
                                            <div>
                                                {#if ethers.utils.formatUnits(token?.tokenVault?.balance , token?.tokenVault?.token?.decimals) != '0.0'}
                                                    <button class="transition-colors text-sm leading-none py-1 px-5 rounded-full text-black" style="background-color: #FDB142;" on:click={() => {
                                                        open(WithdrawModal, {token, orderBookContract})
                                                        // withdraw(vault_.token.id)
                                                    }}>Withdraw</button>
                                                {/if}
                                            </div>
                                            <div>
                                                <button class="transition-colors text-sm leading-none py-1 px-5 rounded-full text-black bgColor" 
                                                    on:click={() => {open(DepositModal, {token, orderBookContract})}}
                                                    disabled = {!order.orderLive}
                                                >Deposit</button>    
                                            </div>
                                                <!-- // deposit(vault_.token.id) -->
                                        </div>
                                    </td>
                                </tr>
                                {/each}
                        </table>
                        <div class="pl-8 text-black">Vault: <a class="items-center text-gray-700 underline hover:text-blue-500" target="_blank"
                            href={`${$selectedNetwork.blockExplorer}/tx/${sloshId}`}>{sloshId.substring(0,15)}...</a></div>
                    </div>
                    <div class="bg-gray-200 p-2 gap-x-4 px-6 my-4">
                        <div class="w-full text-sm flex justify-center items-center text-black font-medium">Threshold : {threshold} %</div>
                    </div>
                </div>
                <div class="grid grid-cols-3 px-14 gap-x-6">
                    <div class="flex flex-col gap-y-2"> 
                        <span class="font-semibold text-black">History</span>
                        <ul class="list-none"> 
                            {#each takeOrders_ as takeOrder_}
                                <li class="leading-7 text-gray-700">{takeOrder_.id.substring(0,12)}...</li>
                            {/each}
                            
                        </ul>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <span class="font-semibold text-black">What was sold</span>
                        <ul class="list-none"> 
                            {#each takeOrders_ as takeOrder_}
                            <!-- <li class="leading-7">{takeOrder_.outputToken.id}  {takeOrder_.output}</li>  -->
                            <li class="leading-7 text-gray-700"><a href="https://mumbai.polygonscan.com/address/{takeOrder_.outputToken.id}">{takeOrder_.outputToken.id.substring(0,5)}...</a>  {takeOrder_.output}</li>

                            {/each}
                            
                        </ul>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <span class="font-semibold text-black">What was bought</span>
                        <ul class="list-none">
                            {#each takeOrders_ as takeOrder_}
                            <li class="leading-7 text-gray-700"><a href="https://mumbai.polygonscan.com/address/{takeOrder_.inputToken.id}">{takeOrder_.inputToken.id.substring(0,5)}...</a>  {takeOrder_.input}</li>
                            {/each}
                        </ul>
                    </div>
            
                </div>
                <span class="grid justify-start px-6 pt-8">
                    {#if order.orderLive}
                    <button class="w-full transition-colors underline text-base leading-none py-2 px-5 text-red-500" on:click={handleClick}>Deactivate Slosh</button>
                    {/if}
                </span>
            {/if}
        </div>
    </Section> 
    {/if}

    {#if txStatus == TxStatus.AwaitingConfirmation}
        <div class="flex flex-col items-center gap-y-5 p-6">
        <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 200px;" loop autoplay></lottie-player>
        <span class="text-lg text-black">Transaction confirming...</span>
        </div>
    {/if}
    {#if txStatus == TxStatus.Error}
        <div class="flex flex-col items-center gap-y-5 p-6">
            <span class="text-lg text-black">Something went wrong.</span>
            <span class="text-lg text-red-400">{errorMsg}</span>
        </div>
    {/if}
  
</div>  


<style>
    ::-webkit-scrollbar {
        width: 2px;
    }
    .bgColor{
        background-color: #FDB142;
    }
    button:disabled{
        background-color: #D2D2D2;
    }  

  

    
</style>