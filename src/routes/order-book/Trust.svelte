<script lang="ts">
    import IconLibrary from "$components/IconLibrary.svelte";
    import Input from "$components/Input.svelte";
    import Switch from "$components/Switch.svelte";
    import { ethers } from "ethers";
    import { signer } from "svelte-ethers-store";
    import orderABI from "./orderbookABI.json"
    import erc20ABI from "./erc20ABI.json"
    import { required } from "$src/validation";
    import { validateFields } from "$src/utils";
    import {utils, OrderBook } from 'rain-sdk'
     import { op , Opcode ,max_uint32,max_uint256 , memoryOperand , MemoryType   } from './opcodes.ts'
    import {tokenAddressess } from "$src/constants" 
    import { concat } from "ethers/lib/utils"; 
  


    let fields: any = {};
    let orderBookContract, thresholdVal
    let checkedTokens = []

    $: if($signer){
        orderBookContract = new ethers.Contract('0x75b4A6c9238A5206adBa189221B90ebbFe4ac248',orderABI , $signer )
        console.log("order", orderBookContract);
    }

    // const getTokenDetails = async () =>{
    //     let token1 = new ethers.Contract(tokenAddressess[0]tokenA, erc20ABI, $signer )
    //     let token2 = new ethers.Contract(tokenAddressess.tokenB, erc20ABI, $signer )
        
    //     tokenAName = await token1.name()
    //     tokenASymbol = await token1.symbol()
    //     tokenADecimals = await token1.decimals()

    //     tokenBName = await token2.name()
    //     tokenBSymbol = await token2.symbol()
    //     tokenBDecimals = await token2.decimals()

    // }
    
    const handleClick = async () => {
        const { validationResult } = await validateFields(fields);

        if (!validationResult) return;
        addOrder()
    };

const addOrder = async () => { 
    
    let x = 1 + ((1 * thresholdVal)/100) 

    let askPrice = ethers.utils.parseEther(x.toString()) 
    

    const askConstants = [max_uint256, askPrice ,max_uint32 ];
    const vAskOutputMax = op( Opcode.STATE,memoryOperand(MemoryType.Constant, 0));
    const vAskPrice = op(Opcode.STATE, memoryOperand(MemoryType.Constant, 1));
    const vExpiresAfter = op(Opcode.STATE, memoryOperand(MemoryType.Constant, 2));
    const ensure =op(Opcode.ENSURE, 1);

    const askSource = concat([ vAskOutputMax,vAskPrice ,vExpiresAfter ,ensure ]);  
    let tokenInput = []
    let tokenOutput = [] 
    let randomNumber = ethers.BigNumber.from(window.crypto.getRandomValues(new Uint8Array(1))[0]) // random number later can be changed . 
    

    for(let i = 0; i < tokenAddressess.length; i++ ){
        if(checkedTokens[i] == true){
            tokenInput.push({"token" : tokenAddressess[i].tokenAddress, "vaultId" : randomNumber})
            tokenOutput.push({"token" : tokenAddressess[i].tokenAddress, "vaultId" : randomNumber })
        }
    }
    
    let askOrderConfig = { 
        interpreter: '0x19dd1aF639604544276353d14439eFC0AD3285E4',
        expressionDeployer: '0x84E24EA1c545927D1515CBbB2E567Efe5248c322',
        validInputs: tokenInput,
        validOutputs: tokenOutput,
        interpreterStateConfig: {
        sources: [askSource],
        constants: askConstants,  
        }, 
        expiresAfter: max_uint32,
    } 

    console.log("askOrderConfig : " , askOrderConfig )

    console.log("askSource : " , askSource )

    let  txAskOrderLive = await orderBookContract.addOrder(askOrderConfig); 
    console.log("txAskOrderLive ")
}  
</script>

<div class="py-4">
    <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                {#each tokenAddressess as token, i}
                    <div class="grid items-stretch border border-orange-400 w-96 rounded-full ">
                        <div class="grid grid-cols-2 items-center  px-10 py-3 border-orange-400"> 
                            <span class="flex items-center gap-x-2">
                                <img src={token.logo} alt="Rain Logo" class="w-7" />
                                <span>{token.tokenName}</span>
                            </span>
                            <span class="flex justify-end"><Switch color="#22c55e" bind:checked={checkedTokens[i]} /></span>
                        </div>
                    </div>
                {/each}
                
    </div>
    <div class="w-full bg-gray-300 p-2 flex justify-center items-center gap-x-4 px-6 my-4">
        <div class="w-full text-sm">Choose a threshold :</div>
        <span class="flex items-center gap-x-2"><Input bgColor="bg-white" bind:value={thresholdVal} type="number" validator={required} bind:this={fields.tiers1} />%</span>
        
    </div>
    <div class="w-full flex px-4 justify-center">
        {#if $signer}
            <button class="bg-orange-400 w-full rounded-full text-base py-3 px-5 text-black" disabled={!$signer} on:click={handleClick}>Ok</button>
        {:else}  
            <span class="">Please connect your wallet</span>
        {/if}
    </div>
</div>