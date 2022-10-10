<script lang="ts">
    import IconLibrary from "$components/IconLibrary.svelte";
    import { client } from "$src/stores";
    import { queryStore } from "@urql/svelte";
    import Info from "./Info.svelte";
    import Item from "./Item.svelte";
    import Label from "./Label.svelte";
    import OtherTokens from "./OtherTokens.svelte";
    import Section from "./Section.svelte";
    import SectionBody from "./SectionBody.svelte";
    import SectionHeading from "./SectionHeading.svelte";

    let deployerList;

$: allTokens = queryStore({
    client: $client,

    query: `
          query {
            emissionsERC20S(orderDirection: desc, orderBy: deployer) {
                deployer
                id
                address
            }
          }`,
    requestPolicy: "network-only"
  });


  $: if($allTokens?.data?.emissionsERC20S){    
    deployerList = Object.values($allTokens?.data?.emissionsERC20S.reduce((a,{deployer, id}) => {
        let key = `${deployer}`;
        a[key] = a[key] || {deployer, count : 0};
        a[key].count++;
        return a;
    }, {}));;

    function sortCount(a,b){
        return b.count - a.count
    }

    deployerList.sort(sortCount)
  }

</script>

<div class="flex gap-x-3 relative">
    <div class="flex w-2/3 flex-col gap-y-6 p-8">
        <div class="mb-2 flex flex-row justify-between gap-y-2 items-center">
            <span class="text-3xl">Top Deployers</span>
            <div>
            <IconLibrary icon="share" />
            </div>
        </div>

        {#if $allTokens.fetching}
            Loading...
        {:else if $allTokens.error}
            Something went wrong...
        {:else if $allTokens.data}
            <Section>
                <SectionHeading>Details</SectionHeading>
                <SectionBody>
                    {#if deployerList}
                    {#each deployerList as list}
                        <div class="flex flex-row border-gray-300">
                            <div class="w-1/2 space-y-4">
                                <Item>
                                    <Label>Deployer</Label>
                                    <Info>
                                        <a
                                        class="text-blue-400 underline"
                                        href={`/#/deployer/${list.deployer}`}>
                                        {list.deployer}
                                        </a>
                                    </Info>
                                </Item>
                            </div>
                            <div class="w-1/2 space-y-4">
                                <Item>
                                    <Label>Total contracts deployed</Label>
                                    <Info>{list.count}</Info>
                                </Item>
                            </div>
                        </div>
                    {/each}
                    {/if}
                </SectionBody>
            </Section>
        {/if}
    </div>

    <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400">
        <OtherTokens />
    </div>
</div>