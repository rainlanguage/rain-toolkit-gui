<script lang="ts">
  import { signer } from "svelte-ethers-store";
  import { formatUnits } from "ethers/lib/utils";
  import Button from "../../components/Button.svelte";
  import Steps from "../../components/steps/Steps.svelte";
  import Ring from "../../components/Ring.svelte";
  import { BigNumber } from "ethers";
  import { selectedNetwork } from "src/stores";
  import { ERC20 } from "rain-sdk";
  import { writable } from "svelte/store";
  import Modal, { bind } from "svelte-simple-modal/src/Modal.svelte";
  import SimpleTransactionModal from "src/components/SimpleTransactionModal.svelte";

  const modal2 = writable(null);
  const modal3 = writable(null);

  enum TxStatus {
    None,
    AwaitingSignature,
    AwaitingConfirmation,
    Error,
  }

  enum RefundSteps {
    Approve,
    Confirm,
    Complete,
  }

  export let transaction,
    token,
    reserve,
    saleContract,
    sale,
    errorMsg,
    activeStep = RefundSteps.Approve,
    txStatus = TxStatus.None,
    txReceipt;

  let rTKN;

  rTKN = new ERC20(token.id, $signer);

  const receipt = transaction.receipt;

  const showApproveModal = () =>
    modal2.set(
      bind(SimpleTransactionModal, {
        method: rTKN.approve,
        args: [saleContract.address, BigNumber.from(receipt.units)],
        confirmationMsg: "Amount Approved",
        func: "approve",
        returnValue,
      })
    );

  const showRefundModal = () =>
    modal3.set(
      bind(SimpleTransactionModal, {
        method: saleContract.refund,
        args: [
          {
            id: BigNumber.from(receipt.receiptId),
            feeRecipient: receipt.feeRecipient,
            fee: BigNumber.from(receipt.fee),
            units: BigNumber.from(receipt.units),
            price: BigNumber.from(receipt.price),
          },
        ],
        confirmationMsg: "Amount Refunded",
        returnValue,
      })
    );

  const returnValue = (method, receipt) => {
    txStatus = TxStatus.None;
    if (method == true) {
      activeStep = RefundSteps.Confirm;
    } else {
      activeStep = RefundSteps.Complete;
      txReceipt = receipt;
    }
  };
</script>

{#if txStatus == TxStatus.None}
  <div class="flex w-600 flex-col items-start gap-y-7">
    <span class="text-xl font-bold">Refund</span>
    <Steps
      steps={["Approve", "Confirm", "Complete"]}
      {activeStep}
      fulfilledTextClass="text-gray-100"
      lineBorderClass="border-gray-400"
    />

    <div class="grid grid-cols-2 gap-4 rounded-md border border-gray-600 p-4">
      <span>Refunding:</span>
      <span>
        {formatUnits(transaction.receipt.units, token.decimals)}
        {token.symbol}
      </span>
      <span>Total refund:</span>
      <span
        >{formatUnits(transaction.totalIn, reserve.decimals)}
        {reserve.symbol}</span
      >
    </div>

    {#if activeStep == RefundSteps.Approve}
      <span>Approve the sale contract to spend your {token.symbol}.</span>
      <Modal
        show={$modal2}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(17, 24, 39, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button on:click={showApproveModal}>Approve</Button>
      </Modal>
    {/if}

    {#if activeStep == RefundSteps.Confirm}
      <span>Confirm your refund.</span>
      <span
        >You will not be able to make another purchase or refund for {sale.cooldownDuration}
        blocks.</span
      >
      <Modal
        show={$modal3}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(17, 24, 39, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button on:click={showRefundModal}>Confirm</Button>
      </Modal>
    {/if}

    {#if activeStep == RefundSteps.Complete}
      <span>Refund confirmed!</span>
      <span
        >You will not be able to make another purchase or refund until block
        <a
          class="text-blue-400 underline"
          target="_blank"
          href={`${$selectedNetwork.blockExplorer}/block/${
            parseInt(sale.cooldownDuration) + txReceipt.blockNumber
          }`}
        >
          {parseInt(sale.cooldownDuration) + txReceipt.blockNumber}
        </a>.
      </span>
      <a
        class="text-blue-400 underline"
        target="_blank"
        href={`${$selectedNetwork.blockExplorer}/tx/${txReceipt?.transactionHash}`}
      >
        See transaction.
      </a>
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
