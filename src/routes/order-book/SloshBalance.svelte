<script lang="ts">
    import Button from "$components/Button.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import Section from "$routes/order-book/Section.svelte";
    import { push } from "svelte-spa-router";
    

    let threshold : number = 2
    const handleClick = () =>{

    }
</script>
<div>
    <Section>
        <div class="py-4">
            <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                <div class="flex justify-between">
                    <span on:click={() =>{push(`/addslosh`)}} class="pl-8"><IconLibrary icon="back" width={14} /></span>
                    <div class="flex flex-col justify-center items-center pb-2">
                        <span class="font-semibold">Slosh Balances</span>
                        <span class="font-normal">(Ox2413fb3709b0...)</span>
                    </div>
                    <div />
                    <!-- <span on:click={() =>{push(`/vaultbalance`)}} class="pl-8"><IconLibrary icon="back" width={14} /></span> -->
                </div>
                <div>
                    <div class="flex flex-col justify-center items-center pb-4">
                        <div class="font-semibold">Token</div>
                        <ul class="list-none ">
                            <li>Electric Vehicles</li>
                            <li>Forest Old Growth</li>
                            <li>Mining</li>
                            <li>Forest Other</li>
                            <li>Forest Other</li>
                        </ul>
                    </div>
                    <div class="pl-8">Vault: <a href="#">Ox2413fb3709b0...</a></div>
                </div>
            </div>
            <div class="w-full bg-gray-300 p-2  gap-x-4 px-6 my-4">
                <div class="w-full text-sm flex justify-center items-center">Threshold : {threshold} %</div>
            </div>
            <div class="grid grid-cols-3 px-14 gap-x-6">
                <div class="flex flex-col gap-y-2">
                    <span class="font-semibold">History</span>
                    <ul class="list-none">
                        <li class="leading-7">oxaabd7d580...</li>
                        <li class="leading-7">oxaabd7d580...</li>
                        <li class="leading-7">oxaabd7d580...</li>
                        <li class="leading-7">oxaabd7d580...</li>
                        <li class="leading-7">oxaabd7d580...</li>
                    </ul>
                </div>
                <div class="flex flex-col gap-y-2">
                    <span class="font-semibold">What was sold</span>
                    <ul class="list-none">
                        <li class="leading-7">Mining 90</li>
                        <li class="leading-7">Electirc Vehicles 89.8</li>
                        <li class="leading-7">Mining 89.6</li>
                        <li class="leading-7">Forest Old Growth 89.4</li>
                        <li class="leading-7">Forest Other 89.2</li>
                    </ul>
                </div>
                <div class="flex flex-col gap-y-2">
                    <span class="font-semibold">What was bought</span>
                    <ul class="list-none">
                        <li class="leading-7">Forest Old growth 90.2</li>
                        <li class="leading-7">Mining 90</li>
                        <li class="leading-7">Electric Vehicles 89.8</li>
                        <li class="leading-7">Mining 89.6</li>
                        <li class="leading-7">Forest 89.4</li>
                    </ul>
                </div>
        
            </div>
            <span class="grid justify-end px-6 pt-8">
                <Button on:click={handleClick}>Deactivate Slosh</Button>
            </span>
        </div>
    </Section>
    <div class="pt-6 pb-4 flex justify-center">
        <span class="font-semibold text-lg italic">How’s the liquidity. So much liquidity.</span>
    </div>
</div>