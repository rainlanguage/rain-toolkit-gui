<script lang="ts">
    import IconLibrary from "$components/IconLibrary.svelte";
    import Input from "$components/Input.svelte";
    import Switch from "$components/Switch.svelte";
    import { ethers } from "ethers";
    import { signer } from "svelte-ethers-store";
    import orderABI from "./orderbookABI.json"
    import Section from "$routes/order-book/Section.svelte";
    import { defaultValidator, required } from "$src/validation";
    import { validateFields } from "$src/utils";
    import { op , Opcode ,max_uint32,max_uint256 , memoryOperand , MemoryType   } from './opcodes.ts'
    import {tokenAddressess } from "$src/constants" 
    import { concat } from "ethers/lib/utils"; 
    import { push } from "svelte-spa-router"; 
    import { Logger } from "ethers/lib/utils";

    import * as Sentry from "@sentry/svelte";

    enum TxStatus {
        None,
        AwaitingConfirmation,
        Error,
    }

    let txStatus = TxStatus.None, errorMsg;
    let fields: any = {};
    let orderBookContract, thresholdVal, sloshName
    let checkedTokens = []

    $: if($signer){
        orderBookContract = new ethers.Contract('0x1d4e06f86d0d07059a4fc76069c1d8660558947e',orderABI , $signer )
    }
    
    const handleClick = async () => {
        const { validationResult } = await validateFields(fields);

        if (!validationResult) return;
        addOrder()
    };

    const addOrder = async () => { 
        try{
        let x = 1 + ((1 * thresholdVal)/100) 

        let askPrice = ethers.utils.parseEther(x.toString()) 
        const askConstants = [max_uint256, askPrice ]; 

        const vAskOutputMax = op( Opcode.READ_MEMORY,memoryOperand(MemoryType.Constant, 0)); 
        const vAskPrice = op(Opcode.READ_MEMORY, memoryOperand(MemoryType.Constant, 1));

        const askSource = concat([ vAskOutputMax,vAskPrice]);  
        let tokenInput = []
        let tokenOutput = [] 
        const nonce = new Uint8Array(32); 
        let val = crypto.getRandomValues(nonce);  
        let randomNumber = ethers.BigNumber.from(ethers.utils.hexlify(val)).toString() // random number later can be changed .

        for(let i = 0; i < tokenAddressess.length; i++ ){
            if(checkedTokens[i] == true){
                tokenInput.push({"token" : tokenAddressess[i].tokenAddress, "vaultId" : randomNumber, decimals : tokenAddressess[i].decimals})
                tokenOutput.push({"token" : tokenAddressess[i].tokenAddress, "vaultId" : randomNumber, decimals : tokenAddressess[i].decimals})
            }
        } 

        let aliceAskOrder = sloshName != "" ? ethers.utils.toUtf8Bytes(sloshName) : []

        let askOrderConfig = { 
            expressionDeployer: '0x5C13ee05006364965093e827521118Ed269091a9',
            interpreter: '0x856b7C73322Dd5F74163C0b9e7586197a1E4496F',
            validInputs: tokenInput,
            validOutputs: tokenOutput,
            interpreterStateConfig: {
                sources: [askSource , [] ],
                constants: askConstants,  
            }, 
            data : aliceAskOrder
        } 
        
            let txAskOrderLive = await orderBookContract.addOrder(askOrderConfig );
            txStatus = TxStatus.AwaitingConfirmation;
            
            let receipt = await txAskOrderLive.wait()

            let sloshId = receipt.events.filter(e => e.event == 'AddOrder')[0].args[2].toHexString()
            
            txStatus = TxStatus.None;
            // setTimeout(5000)
            push(`/sloshes`)
        }catch(error){  
            console.log("error", error);
            
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

<div>
    <Section>
        {#if txStatus == TxStatus.None}
            <div class="pt-4">
                <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                    <div class="flex justify-between pb-1">
                        <span class="cursor-pointer text-black" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span>
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold text-black mr-5">Add Slosh</span>
                        </div>
                        <div />
                    </div>
                    <div class="w-full p-2 px-2 flex justify-center items-start">
                        <span class="w-max font-semibold text-black mr-2 pt-1">Slosh name:</span>
                        <span class="w-2/3">
                            <Input bind:value={sloshName} type="text" validator={defaultValidator} bind:this={fields.sloshName} >
                                <span slot="tip">Tip: Shorter names cost less gas :D</span>
                            </Input>
                        </span>
                    </div>
                    <div class="grid  ht gap-y-2.5">
                        {#each tokenAddressess as token, i}
                            <div class="grid items-stretch border border-orange-400 w-96 rounded-full ">
                                <div class="grid grid-cols-2 items-center px-10 py-3 border-orange-400"> 
                                    <span class="flex items-center gap-x-2">
                                        <img src={token.logo} alt="Rain Logo" class="w-5" />
                                        <span class=" text-black">{token.tokenName}</span>
                                    </span>
                                    <span class="flex justify-end"><Switch color="#418be4" bind:checked={checkedTokens[i]} /></span>
                                </div>
                            </div>
                        {/each}
                    </div>    
                </div>
                <div class="w-full bg-gray-300 p-2 flex justify-center items-center gap-x-4 px-6 my-4">
                    <div class="w-full text-black">Choose a threshold :</div>
                    <span class="flex items-center gap-x-2 text-black"><Input bgColor="bg-white" bind:value={thresholdVal} type="number" validator={required} bind:this={fields.tiers1} />%</span>  
                </div>
                <div class="w-full flex px-4 justify-center">
                    {#if $signer}
                        <button class="w-full rounded-full text-base py-3 px-5 text-black" style="background-color: #FDB142;  box-shadow: inset 0px 2px 6px 0px #ffffff;" disabled={!$signer} on:click={handleClick}>OK</button>
                    {:else}  
                        <span class="">Please connect your wallet</span>
                    {/if}
                </div>
            </div>
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
    </Section>
</div>