<script lang="ts">
  import { reserveContract } from "./mint.ts";
  import { fade } from "svelte/transition";
  import { targetUnits, quote, currencyInfo } from "./mint";
  import type { ContractFunction } from "ethers";
  import Button from "$components/Button.svelte";
  import { contracts } from "svelte-ethers-store";
  import MintAmountInput from "./MintAmountInput.svelte";
  import autoAnimate from "@formkit/auto-animate";
  import IconLibrary from "$components/IconLibrary.svelte";
  import SimpleTransactionModal from "$components/SimpleTransactionModal.svelte";
  import Ring from "$components/Ring.svelte";
  import Quote from "./Quote.svelte";
  import { ConfettiExplosion } from "svelte-confetti-explosion";

  enum MintingSteps {
    SelectAmount,
    ApproveReserve,
    Mint,
    Complete,
  }

  const stepNames: Map<MintingSteps, string> = $currencyInfo.isNative
    ? new Map([
        [MintingSteps.SelectAmount, "1. Select amount"],
        [MintingSteps.Mint, "2. Mint"],
        [MintingSteps.Complete, "3. Complete!"],
      ])
    : new Map([
        [MintingSteps.SelectAmount, "1. Select amount"],
        [MintingSteps.ApproveReserve, "3. Approve"],
        [MintingSteps.Mint, "4. Mint"],
        [MintingSteps.Complete, "5. Complete!"],
      ]);

  let step: MintingSteps = MintingSteps.SelectAmount;

  let contractTransaction: {
    method: ContractFunction;
    args: any[];
    callback: Function;
    confirmationMsg?: string;
  };

  const approve = async () => {
    contractTransaction = {
      method: $reserveContract.approve,
      args: [$contracts.nftContract.address, $quote.totalPrice],
      confirmationMsg: "Approval transaction confirmed",
      callback: () => {
        contractTransaction = null;
        step = MintingSteps.Mint;
      },
    };
  };

  const mint = async () => {
    const args: any[] = [
      {
        maximumPrice: $quote.price,
        minimumUnits: $quote.finalUnits,
        desiredUnits: $quote.finalUnits,
      },
    ];

    if ($currencyInfo.isNative) {
      args.push({ value: $quote.totalPrice });
    }

    contractTransaction = {
      method: $contracts.nftContract.mintNFT,
      args,
      confirmationMsg: "Mint transaction confirmed!",
      callback: () => {
        contractTransaction = null;
        step = MintingSteps.Complete;
      },
    };
  };
</script>

{#if contractTransaction}
  <div in:fade>
    <SimpleTransactionModal
      method={contractTransaction.method}
      args={contractTransaction.args}
      confirmedCallback={contractTransaction.callback}
      confirmationMsg={contractTransaction.confirmationMsg}
      errorCallback={() => {
        contractTransaction = null;
      }}
    />
  </div>
{:else}
  <div use:autoAnimate in:fade class="flex items-stretch flex-col gap-y-12">
    <div class="flex-row gap-x-8 flex border-b border-gray-400 pb-4">
      {#each [...stepNames.entries()] as _step, i}
        {@const active = _step[0] == step}
        {@const complete = _step[0] < step}
        <div class="flex flex-row items-center gap-x-2">
          <div
            class:activeStep={active}
            class:step={!active}
            class:complete
            class="transition-all"
          >
            {_step[1]}
          </div>
          {#if complete}
            <div class="-mt-1">
              <IconLibrary icon="tick" color="text-green-500" width={18} />
            </div>
          {/if}
          {#if i == 4 && active}
            🎉
          {/if}
        </div>
      {/each}
    </div>
    <div use:autoAnimate class="relative flex flex-col gap-y-6 max-w-md">
      {#if step == MintingSteps.SelectAmount}
        <div class="font-heading text-3xl">
          How many NFTs would you like to mint?
        </div>
        <div>
          <MintAmountInput bind:value={$targetUnits} />
        </div>
        <Button
          disabled={!$quote?.totalPrice && !$quote?.finalUnits?.isZero()}
          on:click={() => {
            step++;
          }}>Next</Button
        >
      {:else if step == MintingSteps.ApproveReserve}
        <div class="text-xl font-semibold">
          Approve the minting contract for your {$currencyInfo.symbol}.
        </div>
        <div>
          You need to approve the minting contract to spend your <span
            class="font-semibold">{$currencyInfo.symbol}</span
          >.
        </div>
        <Button on:click={approve}
          >Approve {$quote.totalPriceFormatted}
          {$currencyInfo.symbol}</Button
        >
      {:else if step == MintingSteps.Mint}
        <div class="font-heading text-3xl">Nearly there!</div>
        <div class="text-xl">
          You are minting <span class="font-semibold"
            >{$quote.finalUnits} NFTs</span
          >
          for a total of
          <span class="font-semibold"
            >{$quote.totalPriceFormatted} {$currencyInfo.symbol}</span
          >.
        </div>
        <Button on:click={mint}>Mint</Button>
      {:else if step == MintingSteps.Complete}
        <div class="absolute">
          <ConfettiExplosion />
        </div>
        <div class="text-xl font-semibold">
          Congratulations! You've minted a scriptable NFT.
        </div>
        <!-- <div class="text-lg font-semibold">View on Rarible</div> -->
      {/if}
    </div>
  </div>
  {#if $quote && step !== MintingSteps.Complete}
    <div use:autoAnimate class="mt-8 bg-gray-800 rounded-lg p-4 max-w-md">
      {#if $quote?.targetUnits > 0}
        <div in:fade>
          <Quote quote={$quote} />
        </div>
      {/if}
      {#if $quote?.calculating}
        <div in:fade class="flex flex-row gap-x-2">
          <Ring size="25px" color="#FFF" />
          <span> Getting price... </span>
        </div>
      {/if}
    </div>
  {:else if $quote}
    <span class="text-gray-300"
      >You minted <span class="font-semibold text-white"
        >{$quote.finalUnits} NFTs
      </span>
    </span>
    <div class="">
      <span class="text-gray-300">For</span>
      <span class="font-semibold"
        >{$quote.totalPriceFormatted} {$currencyInfo.symbol}
      </span>
    </div>
  {/if}
{/if}

<style lang="postcss">
  .activeStep {
    @apply font-semibold text-violet-400;
  }

  .step {
    @apply text-gray-300;
  }

  .complete {
    @apply text-gray-300;
  }
</style>
