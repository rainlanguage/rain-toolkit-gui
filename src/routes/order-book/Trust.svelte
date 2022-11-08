<script lang="ts">
    import IconLibrary from "$components/IconLibrary.svelte";
    import Input from "$components/Input.svelte";
    import Switch from "$components/Switch.svelte";
    import { ethers } from "ethers";
    import {onMount} from 'svelte'
    import { signer } from "svelte-ethers-store";
    import orderABI from "./orderbookABI.json"
    import erc20ABI from "./erc20ABI.json"
    import { required } from "$src/validation";
    import { validateFields } from "$src/utils";
    import { parseUnits } from "ethers/lib/utils";

    let fields: any = {};
    let networkName = false, orderBookContract
    let tokenAName, tokenASymbol, tokenADecimals
    let tokenBName, tokenBSymbol, tokenBDecimals, thresholdVal
    let checkedTokens = [false, false]

    onMount(() =>{
        orderBookContract = new ethers.Contract('0x75b4A6c9238A5206adBa189221B90ebbFe4ac248',orderABI , $signer )
        getTokenDetails()


        console.log("order", orderBookContract);
    })

    const getTokenDetails = async () =>{
        let token1 = new ethers.Contract('0x3b55b7b2Eec07cf5F0634B130eFbb1A1e4eDEd0a', erc20ABI, $signer )
        let token2 = new ethers.Contract('0x05cE0B29D94Cb8b156638D06336228b935212652', erc20ABI, $signer )
        console.log("token1", token1);
        
        tokenAName = await token1.name()
        tokenASymbol = await token1.symbol()
        tokenADecimals = await token1.decimals()

        tokenBName = await token2.name()
        tokenBSymbol = await token2.symbol()
        tokenBDecimals = await token2.decimals()

    }
    
    const handleClick = async () => {
        const { validationResult } = await validateFields(fields);

        if (!validationResult) return;
        addOrder()
    };

const addOrder = async () => { 
    let max_uint256 = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");  
    let eighteenZeros = "000000000000000000"; 
    const max_uint32 = ethers.BigNumber.from("0xffffffff");
    // askPrice = 10^18 + 10^18 + givenThreshold
    let askPrice = parseUnits('1', tokenADecimals.toString()) + parseUnits('1', tokenADecimals.toString()) * thresholdVal
    let aliceInputVault = ethers.BigNumber.from(1);
    let aliceOutputVault = ethers.BigNumber.from(2); 

    let provider = new ethers.providers.Web3Provider(window.ethereum)

    await provider.send("eth_requestAccounts", []);

    let signer = await provider.getSigner()   
    console.log("signer : " ,await  signer.getAddress() );     

    //let orderBookCtract = new OrderBook('0xb1AF299454849E40CE04E3521c8076010e1b7B63', signer)  

    let orderBookCtract = new ethers.Contract('0x75b4A6c9238A5206adBa189221B90ebbFe4ac248',abi , signer )

    console.log("orderBookCtract : " , orderBookCtract );


    const askConstants = [max_uint256, askPrice];
    const vAskOutputMax = utils.op(OrderBook.Opcodes.CONSTANT, 0); 
    const vAskPrice = utils.op(OrderBook.Opcodes.CONSTANT, 1);  


    let askSource = new Uint8Array([0,6,0,1,0,6,0,3]) 

    
    let askOrderConfig = { 
        interpreter: '0x19dd1aF639604544276353d14439eFC0AD3285E4',
        expressionDeployer: '0x84E24EA1c545927D1515CBbB2E567Efe5248c322',
        validInputs: [{ token: '0x3b55b7b2Eec07cf5F0634B130eFbb1A1e4eDEd0a', vaultId: aliceInputVault }],
        validOutputs: [{ token: '0x05cE0B29D94Cb8b156638D06336228b935212652', vaultId: aliceOutputVault }],
        interpreterStateConfig: {
        sources: [askSource],
        constants: askConstants,  
        }, 
        expiresAfter: max_uint32,
    }



    console.log("askOrderConfig")
    let  txAskOrderLive = await orderBookCtract.addOrder(askOrderConfig); 
    console.log("txAskOrderLive ")
}  
</script>

<div class="py-4">
    <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                <div class="flex items-stretch border border-orange-400 rounded-full ">
                    <div class="flex items-center justify-between gap-x-32 px-10 py-3 border-orange-400">
                        <span>Token A</span>
                        <Switch color="#22c55e" bind:checked={checkedTokens[0]} />
                    </div>
                </div>
                <div class="flex items-stretch border border-orange-400 rounded-full">
                    <div class="flex items-center justify-between gap-x-32 px-10 py-3 border-orange-400">
                        <span>Token B</span>
                        <Switch color="#22c55e" bind:checked={checkedTokens[1]} />
                    </div>
                </div>
                <!-- <div class="flex items-stretch border border-orange-400 rounded-full">
                    <div class="flex items-center justify-between gap-x-32 px-10 py-3 border-orange-400">
                        <span>Token Name</span>
                        <Switch color="#22c55e" bind:checked={networkName} />
                    </div>
                </div>
                <div class="flex items-stretch border border-orange-400 rounded-full">
                    <div class="flex items-center justify-between gap-x-32 px-10 py-3 border-orange-400">
                        <span>Token Name</span>
                        <Switch color="#22c55e" bind:checked={networkName} />
                    </div>
                </div> -->
                <!-- <div class="flex items-stretch border border-orange-400 rounded-full">
                    <div class="flex items-center justify-between gap-x-32 px-10 py-3 border-orange-400">
                        <span>Token Name</span>
                        <Switch color="#22c55e" bind:checked={networkName} />
                    </div>
                </div> -->
    </div>
    <div class="w-full bg-gray-300 p-2 flex justify-center items-center gap-x-4 px-6 my-4">
        <div class="w-full text-sm">Choose a threshold :</div>
        <span class="flex items-center gap-x-2"><Input bgColor="bg-white" bind:value={thresholdVal} type="number" validator={required} bind:this={fields.tiers1} />%</span>
        
    </div>
    <div class="w-full px-4">
        <button class="bg-orange-400 w-full rounded-full text-base py-3 px-5 text-white ">Ok</button>
    </div>
</div>