<script lang="ts">
  import { formatAddress } from "$src/utils";
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import { selectedNetwork } from "$src/stores";
  import { signer } from "svelte-ethers-store";
  import { formatUnits, parseUnits } from "ethers/lib/utils";
  import Input from "$components/Input.svelte";
  import { required } from "$src/validation";
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

  enum WithdrawSteps {
    Confirm,
    Complete,
  }

  enum PriceConfirmed {
    Pending,
    Confirmed,
  }

  export let _stake,
    errorMsg,
    stakeContract,
    activeStep = WithdrawSteps.Confirm,
    txStatus = TxStatus.None,
    txReceipt,
    calcPricePromise,
    units,
    priceConfirmed = PriceConfirmed.Pending;

  const calculatePrice = async (amount) => {
    priceConfirmed = PriceConfirmed.Pending;
    const _units = parseUnits(amount.toString(), _stake.decimals.toString());
    units = _units;

    priceConfirmed = PriceConfirmed.Confirmed;

    return {
      _units,
    };
  };

  const showModal = () =>
    modal2.set(
      bind(SimpleTransactionModal, {
        method: stakeContract.withdraw,
        args: [units],
        confirmationMsg: "Withdraw confirmed!",
        returnValue,
      })
    );

  const returnValue = (method, receipt) => {
    txStatus = TxStatus.None;
    activeStep = WithdrawSteps.Complete;
    txReceipt = receipt;
  };

  // const withdraw = async () => {
  //   let tx;
  //   txStatus = TxStatus.AwaitingSignature;
  //   try {
  //     tx = await stakeContract.withdraw(units);

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
  //   txStatus = TxStatus.None;
  //   activeStep = WithdrawSteps.Complete;
  // };
</script>

{#if txStatus == TxStatus.None}
  <div class="flex w-600 flex-col items-start gap-y-7">
    <span class="text-xl font-bold">Withdraw</span>
    <Steps
      steps={["Confirm", "Complete"]}
      {activeStep}
      fulfilledTextClass="text-gray-100"
      lineBorderClass="border-gray-400"
    />

    {#if activeStep == WithdrawSteps.Confirm}
      <span>Confirm your withdraw.</span>
      <Input
        type="number"
        debounce
        on:input={({ detail }) => {
          calcPricePromise = calculatePrice(detail);
        }}
        validator={required}
      >
        <span slot="label">Enter the number of stake tokens to unstake:</span>
      </Input>
      <div class="flex flex-row gap-x-3">
        {#if calcPricePromise}
          <div>
            {#await calcPricePromise}
              Getting price...
            {:then result}
              <div class="flex flex-row gap-x-3">
                <span
                  >Amount: {formatUnits(result._units, _stake.token.decimals)}
                  {_stake.token.symbol}
                </span>
              </div>
            {/await}
          </div>
        {/if}
      </div>
      <Modal
        show={$modal2}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(38,38,38, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button disabled={!priceConfirmed} on:click={showModal}
          >Withdraw Amount</Button
        >
      </Modal>
    {/if}

    {#if activeStep == WithdrawSteps.Complete}
      <span>Withdraw confirmed!</span>
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
