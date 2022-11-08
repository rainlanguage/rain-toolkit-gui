<script lang="ts">
    import Tab from "$components/tabs/Tab.svelte";
    import TabList from "$components/tabs/TabList.svelte";
    import TabPanel from "$components/tabs/TabPanel.svelte";
    import Tabs from "$components/tabs/Tabs.svelte";
    import Auction from "./Auction.svelte";
    import Trust from "./Trust.svelte";


</script>
<div class="flex flex-col items-center justify-start py-14">
    <div class="flex flex-col items-center bg-white gap-y-4 pt-4 pb-4 rounded-lg">
    <Tabs>
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
        </TabPanel>
    </Tabs>
</div>
</div>

<style>
    .ht{
        height: 100%;
    }
</style>