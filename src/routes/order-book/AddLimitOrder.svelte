<script lang="ts">
    import IconLibrary from "$components/IconLibrary.svelte";
    import Input from "$components/Input.svelte";
    import Switch from "$components/Switch.svelte";

    import { signer } from "svelte-ethers-store";
    import orderABI from "./orderbookABI.json"
    import Section from "$routes/order-book/Section.svelte";
    import { required } from "$src/validation";
    import { validateFields } from "$src/utils";
    // import { op , Opcode ,max_uint32,max_uint256 , memoryOperand , MemoryType   } from './opcodes.ts'
    import {tokenAddressess } from "$src/constants" 
    // import { concat } from "ethers/lib/utils"; 
    import { provider  } from "svelte-ethers-store";
    
     import { getContractAddressList   } from './zexUtilsFile.js'
  
    //  import {getContractAddressesForChainOrThrow}  from "@0x/contract-addresses" 
    //  const {ContractWrappers} = require("@0x/contract-wrappers"); 
    //  const {  Web3ProviderEngine, SignerSubprovider } = require( '@0x/subproviders') 
    //  const { providerUtils } = require( '@0x/utils' );
    //  const { Web3Wrapper } = require( '@0x/web3-wrapper' );  


    
    // import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses' 

    // import { ContractWrappers } from '@0x/contract-wrappers'; 

    import { LimitOrder } from '@0x/protocol-utils'; 

    // import { BigNumber, hexUtils , providerUtils  } from '@0x/utils';
    // import { Web3Wrapper } from '@0x/web3-wrapper';  

    // export let params: {
    //     wild: string;
    // };    

    let fields: any = {};
    let  thresholdVal
    let checkedTokens = [] 

 

    $: if($signer){
       
    }
    
    const handleClick = async () => {   

        let res =   getContractAddressesForChainOrThrow(80001)   
        console.log("res :" , res)

        // const providerEngine = new Web3ProviderEngine(); 
        // providerEngine.addProvider(new SignerSubprovider($provider)) 

        // providerUtils.startProviderEngine(providerEngine); 


        // const web3Wrapper = new Web3Wrapper(providerEngine);
        // const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
        
        // console.log("maker : " , maker)


        
    };

    const addOrder = async () => { 
        
    
    }  
</script>
<div>
    <Section>
    <div class="py-4">
        <div class="flex flex-col gap-y-2 px-4 pt-2 ">
            <div class="flex justify-between pb-4">
                <span class="cursor-pointer" on:click={() =>{history.back()}}><IconLibrary icon="back" width={14} /></span>
                <div class="flex flex-col justify-center items-center pb-2">
                    <span class="font-semibold">Add Slosh</span>
                    <!-- <span class="font-normal">(Ox2413fb3709b0...)</span> -->
                </div>
                <div />
                <!-- <span on:click={() =>{push(`/sloshbalance`)}}><IconLibrary icon="forward" width={14} /></span> -->
            </div>
            <div class="grid overflow-y-scroll max-h-72 gap-y-2.5">
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
        </div>
        <div class="w-full bg-gray-300 p-2 flex justify-center items-center gap-x-4 px-6 my-4">
            <div class="w-full ">Choose a threshold :</div>
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
    </Section>
</div>
<style>
    ::-webkit-scrollbar {
        width: 5px;
    }
</style>