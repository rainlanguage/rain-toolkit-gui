<script lang="ts">
  import type { NFTData } from "$src/types";
  import { contractInfo } from "./mint";
  import { nextTokenMetadata, singleQuote } from "./feelerhead-mint";
  import { onDestroy, onMount } from "svelte";
  import TokenPreview from "$components/nft/TokenPreview.svelte";

  // defaultEvmStores.setProvider(PROVIDER, null);

  let interval;
  let data: NFTData;
  onMount(() => {
    interval = setInterval(() => {
      if (!$nextTokenMetadata?.image) {
        contractInfo.refresh();
      }
    }, 10 * 1000); // refresh every 10 seconds
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  $: show = $nextTokenMetadata && $singleQuote && $contractInfo;

  $: data = {
    imageSrc: $nextTokenMetadata?.image,
    name: $nextTokenMetadata?.name,
    description: $nextTokenMetadata?.description,
    tokenId: +$contractInfo?.noOfNfts + 1,
    totalSupply: $contractInfo?.supplyLimit,
  };
</script>

<TokenPreview {data} />
