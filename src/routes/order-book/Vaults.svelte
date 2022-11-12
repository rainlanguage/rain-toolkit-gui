<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import { push } from "svelte-spa-router";
    import { signer } from "svelte-ethers-store";
    import {tokenAddressess } from "$src/constants" 

    const addVault = () =>{

        //put this line at bottom
        push('/sloshes')
    }
</script>
<div>
    <Section>
        <div class="py-4">
            <div class="flex flex-col gap-y-2 px-6 pt-2 ">
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
                        {#each tokenAddressess as add}
                            <span class="flex flex-col leading-7">{add.tokenAddress}</span>
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
        </div>
    </Section>
</div>