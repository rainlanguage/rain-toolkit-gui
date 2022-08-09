<script lang="ts">
  import type { MintQuote } from "./mint";
  import { currencyInfo } from "./mint";

  export let quote: MintQuote;
</script>

<div class="flex flex-col gap-y-2">
  <span
    >Minting <span class="font-semibold">{quote.finalUnits} NFTs </span></span
  >
  <div class="flex flex-col">
    <span>Total price</span>
    <span class="font-semibold"
      >{quote.totalPriceFormatted} {$currencyInfo.symbol}
    </span>
  </div>
</div>
