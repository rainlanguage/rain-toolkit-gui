<script lang="ts">
  import Button from "components/Button.svelte";
  import Steps from "components/steps/Steps.svelte";
  import { BLOCK_EXPLORER } from "src/constants";
  import Ring from "components/Ring.svelte";
  import { ethers } from "ethers";
  import { getContext } from "svelte";

  const { close } = getContext("simple-modal");

  enum TxStatus {
    None,
    AwaitingSignature,
    AwaitingConfirmation,
    Error,
  }

  enum ApproveSteps {
    Approve,
    Complete,
  }

  export let signer, reserve, sale, saleData;

  let activeStep = ApproveSteps.Approve,
    txStatus = TxStatus.None,
    txReceipt,
    errorMsg;

  const approve = async () => {
    txStatus = TxStatus.AwaitingSignature;
    const tx = await reserve.approve(saleData.id, ethers.constants.MaxUint256);

    txStatus = TxStatus.AwaitingConfirmation;
    txReceipt = await tx.wait();

    activeStep = ApproveSteps.Complete;
    txStatus = TxStatus.None;
  };
</script>

{#if txStatus == TxStatus.None}
  <div class="flex w-600 flex-col items-start gap-y-7">
    <span class="text-xl font-bold">Approve</span>

    <Steps
      steps={["Approve", "Complete"]}
      {activeStep}
      fulfilledTextClass="text-gray-100"
      lineBorderClass="border-gray-400"
    />

    {#if activeStep == ApproveSteps.Approve}
      <span
        >Approve the sale contract to spend your {saleData.token.symbol}</span
      >
      <Button on:click={approve}>Approve</Button>
    {/if}

    {#if activeStep == ApproveSteps.Complete}
      <span>Approval confirmed.</span>
      <span>You can now purchase from this sale. </span>
      <a
        class="text-blue-400 underline"
        target="_blank"
        href={`${BLOCK_EXPLORER}/tx/${txReceipt?.transactionHash}`}
      >
        See transaction.
      </a>
      <Button
        on:click={() => {
          close();
        }}>Ok</Button
      >
    {/if}
  </div>
{/if}

{#if txStatus == TxStatus.AwaitingSignature}
  <div class="flex flex-col items-center gap-y-5 p-6">
    <Ring color="#fff" />
    <span class="text-lg">Awaiting signature...</span>
  </div>
{/if}

{#if txStatus == TxStatus.AwaitingConfirmation}
  <div class="flex flex-col items-center gap-y-5 p-6">
    <Ring color="#fff" />
    <span class="text-lg">Transaction confirming...</span>
  </div>
{/if}

{#if txStatus == TxStatus.Error}
  <div class="flex flex-col items-center gap-y-5 p-6">
    <span class="text-lg">Something went wrong.</span>
    <span class="text-lg text-red-400">{errorMsg}</span>
  </div>
{/if}