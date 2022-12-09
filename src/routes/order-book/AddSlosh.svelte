<script lang="ts">
    import IconLibrary from "$components/IconLibrary.svelte";
    import Input from "$components/Input.svelte";
    import Switch from "$components/Switch.svelte";
    import { ethers } from "ethers";
    import { signer } from "svelte-ethers-store";
    import orderABI from "./orderbookABI.json"
    import Section from "$routes/order-book/Section.svelte";
    import { required } from "$src/validation";
    import { validateFields } from "$src/utils";
    import { op , Opcode ,max_uint32,max_uint256 , memoryOperand , MemoryType   } from './opcodes.ts'
    import {tokenAddressess } from "$src/constants" 
    import { concat } from "ethers/lib/utils"; 

    export let params: {
        wild: string;
    }; 

    let fields: any = {};
    let orderBookContract, thresholdVal
    let checkedTokens = []

    $: if($signer){
        orderBookContract = new ethers.Contract('0x927f3f0579258fe1c96f9331e496cb1e091d0224',orderABI , $signer )
    }
    
    const handleClick = async () => {
        const { validationResult } = await validateFields(fields);

        if (!validationResult) return;
        addOrder()
    };

const addOrder = async () => { 
    
    let x = 1 + ((1 * thresholdVal)/100) 

    let askPrice = ethers.utils.parseEther(x.toString()) 
    const askConstants = [max_uint256, askPrice ]; 

    const vAskOutputMax = op( Opcode.READ_MEMORY,memoryOperand(MemoryType.Constant, 0)); 
    const vAskPrice = op(Opcode.READ_MEMORY, memoryOperand(MemoryType.Constant, 1));

    const askSource = concat([ vAskOutputMax,vAskPrice]);  
    let tokenInput = []
    let tokenOutput = [] 
    let randomNumber = params.wild // random number later can be changed . 
    

    for(let i = 0; i < tokenAddressess.length; i++ ){
        if(checkedTokens[i] == true){
            tokenInput.push({"token" : tokenAddressess[i].tokenAddress, "vaultId" : randomNumber})
            tokenOutput.push({"token" : tokenAddressess[i].tokenAddress, "vaultId" : randomNumber })
        }
    } 

    
    let askOrderConfig = { 
        expressionDeployer: '0x5C13ee05006364965093e827521118Ed269091a9',
        interpreter: '0x856b7C73322Dd5F74163C0b9e7586197a1E4496F',
        validInputs: tokenInput,
        validOutputs: tokenOutput,
        interpreterStateConfig: {
            sources: [askSource , [] ],
            constants: askConstants,  
        }, 
    } 
    let  txAskOrderLive = await orderBookContract.addOrder(askOrderConfig );  
}  
</script>
<div>
    <Section>
    <div class="pt-4">
        <div class="flex flex-col gap-y-2 px-4 pt-2 ">
            <div class="flex justify-between pb-4">
                <span class="cursor-pointer text-black" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span>
                <div class="flex flex-col justify-center items-center pb-2">
                    <span class="font-semibold text-black mr-5">Add Slosh</span>
                    <!-- <span class="font-normal">(Ox2413fb3709b0...)</span> -->
                </div>
                <div />
                <!-- <span on:click={() =>{push(`/sloshbalance`)}}><IconLibrary icon="forward" width={14} /></span> -->
            </div>
            <div class="grid  ht gap-y-2.5">
                 {#each tokenAddressess as token, i}
                    <div class="grid items-stretch border border-orange-400 w-96 rounded-full ">
                        <div class="grid grid-cols-2 items-center px-10 py-3 border-orange-400"> 
                            <span class="flex items-center gap-x-2">
                                <img src={token.logo} alt="Rain Logo" class="w-5" />
                                <span class=" text-black">{token.tokenName}</span>
                            </span>
                            <span class="flex justify-end"><Switch color="#22c55e" bind:checked={checkedTokens[i]} /></span>
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
                <button class="w-full rounded-full text-base py-3 px-5 text-black" style="background-color: #FDB142;  box-shadow: inset 0px 2px 6px 0px #ffffff;" disabled={!$signer} on:click={handleClick}>Ok</button>
            {:else}  
                <span class="">Please connect your wallet</span>
            {/if}
        </div>
    </div>
    </Section>
</div>
<!-- <style>
    ::-webkit-scrollbar {
        width: 5px;
    }
    .ht{
        max-height: 17rem;
    }
</style> -->