<script lang="ts">
  import type { MintQuote } from "./mint";
  import { currencyInfo } from "./mint";

  export let quote: MintQuote;
</script>

<div class="flex flex-col gap-y-2">
  <span class="text-gray-300"
    >You can mint <span class="font-semibold text-white"
      >{quote.finalUnits} NFTs
    </span></span
  >
  <div class="flex flex-col">
    <span class="text-gray-300">Total price</span>
    <span class="font-semibold"
      >{quote.totalPriceFormatted} {$currencyInfo.symbol}
    </span>
  </div>
</div>
