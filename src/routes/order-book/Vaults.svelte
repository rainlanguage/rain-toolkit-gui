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
        console.log(vaultIds)

    }

    const addVault = () =>{

        let randomVaultId = Math.floor(100000 + Math.random() * 900000)
        push(`/sloshes/${randomVaultId}`) 
    }
</script> 

<div class="flex items-center justify-center">
    <Section>
        <div class="py-4 px-4">
            {#if $vaults.fetching}
                <div class="p-4">
                    <Ring color="#1D4ED8" />
                    <div>Loading...</div>
                </div>
            {:else if $vaults.error}
                <div class="text-red-400 font-medium text-xl px-4 py-4">
                    Please connect your wallet<br />
                    to get vault Ids
                </div>
            {:else}
                <div class="flex flex-col gap-y-2 px-2 pt-2 ">
                    <div class="flex justify-between pb-6">
                        <span />
                        <!-- <span on:click={() =>{push(`/sloshes`)}}><IconLibrary icon="back" width={14} /></span> -->
                        <div class="flex flex-col justify-center items-center pb-2">
                            <span class="font-semibold">Vaults</span>
                            <!-- <span class="font-normal">(Ox2413fb3709b0...)</span> -->
                        </div>
                        <span />
                        <!-- <span on:click={() =>{push(`/sloshbalance`)}}><IconLibrary icon="forward" width={14} /></span> -->
                    </div>
                    <div class="px-10">
                        <div class="pb-10">
                            {#each vaultIds as id}
                                <span class="flex flex-col leading-7 items-center underline hover:text-blue-500">
                                    <a href="/#/sloshes/{id}">{id}</a>
                                </span>
                            {/each}
                        </div>

                        <div class="w-full flex px-6 justify-center">
                            {#if $signer}
                                <button class="bg-orange-400 w-full rounded-full text-base py-3 px-5 text-black" disabled={!$signer} on:click={addVault}>Add a vault</button>
                            {:else}  
                                <span class="">Please connect your wallet</span>
                            {/if}
                        </div> 
                    </div>
                    <div class="px-6 pt-4">
                        <div class="border-b border-gray-300" />
                        <div class="flex pt-2 justify-center text-center"><span>
                            Make a vault to start Sloshing!
                        </span></div>
                    </div>
                </div>
            {/if}
        </div>
    </Section>
</div> 