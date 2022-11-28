<script lang="ts">
    // import Tab from "$components/tabs/Tab.svelte";
    // import TabList from "$components/tabs/TabList.svelte";
    // import TabPanel from "$components/tabs/TabPanel.svelte";
    // import Tabs from "$components/tabs/Tabs.svelte";
    // import Auction from "./Auction.svelte";
    // import AddSlosh from "./AddSlosh.svelte";
    // import SloshBalance from "./SloshBalance.svelte";
    // import VaultBalance from "./VaultBalance.svelte";

    import { signerAddress } from 'svelte-ethers-store'
    import { push } from "svelte-spa-router";
    $: if($signerAddress){
        console.log("signer", $signerAddress);
        
        push(`/vaults`) 
    }

</script>
<div>
        <!-- <Tabs>
                <div class="flex justify-center">
                    <TabList>
                        <Tab>Trust</Tab>
                        <Tab>Auction</Tab>
                    </TabList>
                </div>
                <TabPanel>
                    <Trust />
                </TabPanel>
                <TabPanel>
                    <Auction />
                    <div class="w-96 p-6 flex justify-center">Work in progress</div>
                </TabPanel>
        </Tabs> -->
        <!-- <Router>
            <Route component={AddSlosh} />
            <Route path="sloshbalance" component={SloshBalance}/>
            <Route path="vaultbalance" component={VaultBalance} />
        </Router> -->
</div>