<script lang="ts">
  import { Signer } from "ethers";
  import { Writable } from "svelte/store";
  import { tierReport } from "src/utils";
  import { ITier } from "rain-sdk";

  interface TierData {
    __typename: string;
    id: string;
  }
  export let signer: Writable<Signer | undefined>;
  export let tierData: TierData;
  export let minimumStatus: number;
  export let againstBlock: number;
  export let readableTiers: Array<string> = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ];

  let eligibleStatus;

  const checkTier = async (tier, minimumStatus: number) => {
    const report = await tier.report($signer.getAddress());
    const parsedReport = tierReport(report);

    if (minimumStatus !== 0) {
      for (let i = 0; i < 8; i++) {
        if (parsedReport[i] < againstBlock) {
          eligibleStatus = i + 1;
        } else {
          break;
        }
      }
    }
  };

  $: if ($signer && minimumStatus !== undefined && tierData?.id) {
    const tier = new ITier(tierData.id, $signer);

    checkTier(tier, minimumStatus);
  }
</script>

{#if minimumStatus !== 0}
  <div>
    This raise is gated by a {tierData.__typename}.
  </div>
  <div>
    You must have been at least tier {readableTiers[minimumStatus - 1]} at block
    {againstBlock}
    to participate in this Sale.
  </div>
  <div>
    {#if eligibleStatus}
      At block {againstBlock} you were tier {readableTiers[eligibleStatus - 1]}.
    {:else}
      At block {againstBlock} you had no tier.
    {/if}
  </div>
  {#if eligibleStatus >= minimumStatus}
    <div>✅ You are eligible for this Sale.</div>
  {:else}
    <div>❌ You are not eligible for this Sale.</div>
  {/if}
{:else}
  <div>There is no tier gating for this Sale.</div>
{/if}
