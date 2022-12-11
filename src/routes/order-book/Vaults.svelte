<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import { push } from "svelte-spa-router";
    import { signer , signerAddress } from "svelte-ethers-store"; 
    import { client } from "$src/stores";
    
    import { queryStore } from "@urql/svelte";
    import Ring from "$components/Ring.svelte";
   
    let ownerAddress
    let vaultIds 
    
    $: if($signer) {
        ownerAddress = $signerAddress?.toLowerCase()
    }

    $: vaults = queryStore({
        client: $client,
        query: `
            query ($owner: Bytes!) { 
                tokenVaults(where: {owner: $owner}){
                    vaultId
                }
            }`,
        variables: { owner : ownerAddress }
        
    });  

    $: data = $vaults.data; 

    $: if (data ) {  
        vaultIds = data.tokenVaults.map(e => {return e.vaultId} ).filter(function(item,index ,arr){  return arr.indexOf(item) == index;  })  

    }

    const addVault = () =>{

        let randomVaultId = Math.floor(100000 + Math.random() * 900000)
        push(`/sloshes/${randomVaultId}`) 
    }
</script> 

<div class="flex items-center justify-center pt-14">
    <Section outerpB="pb-0" innerpB="pb-3">
        <div class="pt-4 px-4">
            {#if $vaults.fetching}
            <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>
                <!-- <div class="p-4 ">
                    <Ring color="#1D4ED8" size="128px" />
                     <div class=" text-black">Loading...</div> 
                </div> -->
            {:else if $vaults.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-2 pt-2 ">
                    <div class="flex justify-between pb-6">
                        <span />
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold text-black">Vaults</span>
                            <!-- <span class="font-normal">(Ox2413fb3709b0...)</span> -->
                        </div>
                        <span />
                    </div>
                    <div class="px-10">
                        <div class="pb-10">
                            {#each vaultIds as id}
                                <span class="flex flex-col leading-7 items-center underline hover:text-blue-500 text-black">
                                    <a href="/#/vaultbalance/{id}">{id}</a>
                                </span>
                            {/each}
                        </div>

                        <div class="w-full flex px-1 justify-center">
                            {#if $signer}
                                <button class="w-full rounded-full text-base py-3 px-28 text-black" style="background-color: #FDB142; box-shadow: inset 0px 2px 6px 0px #ffffff;" disabled={!$signer} on:click={addVault}>Add a vault</button>
                            {:else}  
                                <span class="">Please connect your wallet</span>
                            {/if}
                        </div> 
                    </div>
                    <div class="border-b pt-4 border-gray-300" />
                    <div class="px-6">
                        <div class="flex pt-1 justify-center text-center text-black"><span>
                            Make a vault to start Sloshing!
                        </span></div>
                    </div>
                </div>
            {/if}
        </div>
    </Section>
</div> 

<style>
    ::-webkit-scrollbar {
        width: 2px;
    }
    /* ::-webkit-scrollbar-thumb {
        background: #e5e5e5; 
        border-radius: 10px;
        
    } */
</style>