<script lang="ts">
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import { ethers } from "ethers";
  import { getContext } from "svelte";
  import { selectedNetwork } from "$src/stores";

  import SimpleTransactionModal from "$components/SimpleTransactionModal.svelte";
  import { writable } from "svelte/store";
  import Modal, { bind } from "svelte-simple-modal/src/Modal.svelte";

  const modal2 = writable(null);

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

  const showApproveModal = () =>
    modal2.set(
      bind(SimpleTransactionModal, {
        method: reserve.approve,
        args: [saleData.id, ethers.constants.MaxUint256],
        confirmationMsg: "Amount Approved",
        func: "approve",
        returnValue,
      })
    );

  const returnValue = (method, receipt) => {
    txStatus = TxStatus.None;

    if (method == true) {
      activeStep = ApproveSteps.Complete;
      txReceipt = receipt;
    }
  };

  // const approve = async () => {
  //   let tx;
  //   txStatus = TxStatus.AwaitingSignature;

  //   try {
  //     tx = await reserve.approve(saleData.id, ethers.constants.MaxUint256);

  //     txStatus = TxStatus.AwaitingConfirmation;
  //     txReceipt = await tx.wait();
  //   } catch (error) {
  //     if (error.code === Logger.errors.TRANSACTION_REPLACED) {
  //       if (error.cancelled) {
  //         errorMsg = "Transaction Cancelled";
  //         txStatus = TxStatus.Error;
  //         return;
  //       } else {
  //         txReceipt = await error.replacement.wait();
  //       }
  //     } else {
  //       errorMsg =
  //         error.error?.data?.message ||
  //         error.error?.message ||
  //         error.data?.message ||
  //         error?.message;
  //       txStatus = TxStatus.Error;
  //       return;
  //     }
  //   }

  //   activeStep = ApproveSteps.Complete;
  //   txStatus = TxStatus.None;
  // };
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
      <Modal
        show={$modal2}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(38,38,38, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button on:click={showApproveModal}>Approve</Button>
      </Modal>
    {/if}

    {#if activeStep == ApproveSteps.Complete}
      <span>Approval confirmed.</span>
      <span>You can now purchase from this sale. </span>
      <a
        class="text-blue-400 underline"
        target="_blank"
        href={`${$selectedNetwork.blockExplorer}/tx/${txReceipt?.transactionHash}`}
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
