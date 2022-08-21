<script lang="ts">
  import { formatAddress } from "$src/utils";
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import { selectedNetwork } from "$src/stores";
  import { signer } from "svelte-ethers-store";
  import { RedeemableERC20ClaimEscrow } from "rain-sdk";
  import { writable } from "svelte/store";
  import Modal, { bind } from "svelte-simple-modal/src/Modal.svelte";
  import SimpleTransactionModal from "$components/SimpleTransactionModal.svelte";

  const modal2 = writable(null);

  enum TxStatus {
    None,
    AwaitingSignature,
    AwaitingConfirmation,
    Error,
  }

  enum SweepingSteps {
    Confirm,
    Complete,
  }

  export let data,
    salesContract,
    errorMsg,
    activeStep = SweepingSteps.Confirm,
    txStatus = TxStatus.None,
    txReceipt;
  let redeemableEscrow;

  (async () =>
    (redeemableEscrow = await RedeemableERC20ClaimEscrow.get(
      salesContract.address,
      data.deposit.token.id,
      $signer
    )))();

  const showModal = () =>
    modal2.set(
      bind(SimpleTransactionModal, {
        method: redeemableEscrow.sweepPending,
        args: [data.depositorAddress],
        confirmationMsg: "Withdraw confirmed!",
        returnValue,
      })
    );

  const returnValue = (method, receipt) => {
    txStatus = TxStatus.None;
    activeStep = SweepingSteps.Complete;
    txReceipt = receipt;
  };
</script>

{#if txStatus == TxStatus.None}
  <div class="flex w-600 flex-col items-start gap-y-7">
    <span class="text-xl font-bold">Sweep Pending Deposit</span>
    <Steps
      steps={["Confirm", "Complete"]}
      {activeStep}
      fulfilledTextClass="text-gray-100"
      lineBorderClass="border-gray-400"
    />

    <div class="grid grid-cols-2 gap-4 rounded-md border border-gray-600 p-4">
      <span>Sale Address:</span>
      <span>{formatAddress(data.iSaleAddress)}</span>

      <span>Token Address:</span>
      <span>{formatAddress(data.token.id)}</span>

      <span>Depositor Address:</span>
      <span>{formatAddress(data.depositorAddress)}</span>
    </div>

    {#if activeStep == SweepingSteps.Confirm}
      <span>Confirm your Sweep Pending Deposit.</span>
      <Modal
        show={$modal2}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(38,38,38, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button on:click={showModal}>Confirm</Button>
      </Modal>
    {/if}

    {#if activeStep == SweepingSteps.Complete}
      <span>Sweeping confirmed!</span>
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
