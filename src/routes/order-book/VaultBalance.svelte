<script lang="ts">
    import Button from "$components/Button.svelte";
    import IconLibrary from "$components/IconLibrary.svelte";
    import Section from "$routes/order-book/Section.svelte";
    import SloshBalance from "./SloshBalance.svelte";
    import { push } from "svelte-spa-router";

    let threshold : number = 2
</script>
<div>
    <Section>
        <div class="py-4 px-6">
            <div class="flex flex-col gap-y-2 px-4 pt-2 ">
                <div class="flex justify-between">
                    <span on:click={() =>{push(`/sloshbalance`)}}><IconLibrary icon="back" width={14} /></span>
                    <div class="flex flex-col justify-center items-center pb-2">
                        <span class="font-semibold">Vault Balances</span>
                        <span class="font-normal">(Ox2413fb3709b0...)</span>
                    </div>
                    <div />
                </div>
                <div>
                    <table class="table-fixed">
                        <tr class="font-semibold ">
                          <th class="text-left pb-2 w-52">Token</th>
                          <th class="text-left pb-2 w-52">Vault Balances</th>
                          <th class="w-52"/>
                        </tr>
                        <tr class="gap-x-4">
                            <td class="pr-6">Electric Vehicles</td>
                            <td class="pr-6">50</td>
                            <td class="py-2">
                                <div class="flex justify-between">
                                    <div>
                                        <Button small bRadius="rounded-full" variant="bg-orange-400">Withdraw</Button>
                                    </div>
                                    <div><Button small bRadius="rounded-full" variant="bg-orange-400">Deposit</Button></div>
                                </div>
                            </td>
                        </tr>
                        <tr class="gap-x-4">
                            <td class="pr-6">Forest Old Growth</td>
                            <td class="pr-6">90.2</td>
                            <td class="py-2">
                                <div class="flex justify-between">
                                    <div>
                                        <Button small bRadius="rounded-full" variant="bg-orange-400">Withdraw</Button>
                                    </div>
                                    <div><Button small bRadius="rounded-full" variant="bg-orange-400">Deposit</Button></div>
                                </div>
                            </td>
                        </tr>
                        <tr class="gap-x-4">
                            <td class="pr-6">Mining</td>
                            <td class="pr-6">0</td>
                            <td class="py-2">
                                <div class="flex justify-between">
                                    <div>
                                        <Button small bRadius="rounded-full" variant="bg-orange-400">Withdraw</Button>
                                    </div>
                                    <div><Button small bRadius="rounded-full" variant="bg-orange-400">Deposit</Button></div>
                                </div>
                            </td>
                        </tr>
                        <tr class="gap-x-4">
                            <td class="pr-6">Forest Other</td>
                            <td class="pr-6">10</td>
                            <td class="py-2">
                                <div class="flex justify-between">
                                    <div>
                                        <Button small bRadius="rounded-full" variant="bg-orange-400">Withdraw</Button>
                                    </div>
                                    <div><Button small bRadius="rounded-full" variant="bg-orange-400">Deposit</Button></div>
                                </div>
                            </td>
                        </tr>
                        <tr class="gap-x-4">
                            <td class="pr-6">Forest Other</td>
                            <td class="pr-6">12,000</td>
                            <td class="py-2">
                                <div class="flex justify-between">
                                    <div>
                                        <Button small bRadius="rounded-full" variant="bg-orange-400">Withdraw</Button>
                                    </div>
                                    <div><Button small bRadius="rounded-full" variant="bg-orange-400">Deposit</Button></div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="flex flex-col justify-center items-center pt-6 gap-y-2">
                <div class="font-semibold">Sloshes</div>
                <ul class="list-none ">
                    <li class="leading-8">oxaabd7d580...</li>
                    <li class="leading-8">oxaabd7d580...</li>
                    <li class="leading-8">oxaabd7d580...</li>
                    <li class="leading-8">oxaabd7d580...</li>
                    <li class="leading-8">oxaabd7d580...</li>
                </ul>
            </div>
        </div>
    </Section>
    <div class="pt-6 pb-4 flex justify-center">
        <span class="font-semibold text-lg italic">How’s the liquidity. So much liquidity.</span>
    </div>
</div>