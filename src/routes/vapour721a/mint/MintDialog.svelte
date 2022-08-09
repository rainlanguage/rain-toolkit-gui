<script lang="ts">
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
      method: $contracts.reserve.approve,
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
  <div in:fade class="flex flex-col-reverse items-stretch md:flex-row">
    <div
      use:autoAnimate
      class="flex w-60 flex-col gap-y-6 border-gray-500 px-8 pb-8 md:border-r md:p-8"
    >
      <div class="hidden flex-col gap-y-6 md:flex">
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
                <IconLibrary icon="tick" color="text-primary" width={18} />
              </div>
            {/if}
            {#if i == 4 && active}
              🎉
            {/if}
          </div>
        {/each}
      </div>
      {#if $quote}
        <div use:autoAnimate class="border-gray-500 md:border-t md:pt-6">
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
      {/if}
    </div>
    <div use:autoAnimate class="relative flex w-96 flex-col gap-y-6 p-8">
      {#if step == MintingSteps.SelectAmount}
        <div class="font-heading text-3xl">
          How many NFTs would you like to mint?
        </div>
        <div>
          <MintAmountInput bind:value={$targetUnits} />
        </div>
        <Button disabled={!$quote?.totalPrice} on:click={null}>Next</Button>
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
          Congratulations! You are now a proud owner of a Feelerhead.
        </div>
        <div class="text-lg font-semibold">Next steps</div>
      {/if}
    </div>
  </div>
{/if}

<style lang="postcss">
  .activeStep {
    @apply font-semibold text-gray-700;
  }

  .step {
    @apply text-gray-300;
  }

  .complete {
    @apply text-gray-300;
  }
</style>
