<script lang="ts">
  import { formatUnits, Logger, parseUnits } from "ethers/lib/utils";
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import { selectedNetwork } from "$src/stores";
  import Input from "$components/Input.svelte";
  import { RedeemableERC20ClaimEscrow } from "rain-sdk";
  import { signer } from "svelte-ethers-store";
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
  enum PriceConfirmed {
    Pending,
    Confirmed,
  }

  enum UndepositSteps {
    Confirm,
    Complete,
  }

  export let data,
    salesContract,
    errorMsg,
    activeStep = UndepositSteps.Confirm,
    txStatus = TxStatus.None,
    txReceipt;

  let priceConfirmed = PriceConfirmed.Pending,
    units,
    redeemableEscrow,
    calcPricePromise;

  const calculatePrice = async (amount) => {
    priceConfirmed = PriceConfirmed.Pending;
    const _amountUnits = parseUnits(
      amount.toString(),
      data.token.decimals.toString()
    );

    if (_amountUnits <= data.totalRemaining) {
      const one = parseUnits("1", data.token.decimals.toString());
      const _units = parseUnits(
        amount.toString(),
        data.token.decimals.toString()
      );
      units = _units;
      priceConfirmed = PriceConfirmed.Confirmed;

      return { _units };
    } else {
      return false;
    }
  };

  (async () =>
    (redeemableEscrow = await RedeemableERC20ClaimEscrow.get(
      salesContract.address,
      data.token.id,
      $signer
    )))();

  const showModal = () =>
    modal2.set(
      bind(SimpleTransactionModal, {
        method: redeemableEscrow.undeposit,
        args: [data.redeemableSupply, units],
        confirmationMsg: "Undeposit confirmed!",
        returnValue,
      })
    );

  const returnValue = (method, receipt) => {
    txStatus = TxStatus.None;
    activeStep = UndepositSteps.Complete;
    txReceipt = receipt;
  };
</script>

{#if txStatus == TxStatus.None}
  <div class="flex w-600 flex-col items-start gap-y-7">
    <span class="text-xl font-bold">Undeposit</span>
    <Steps
      steps={["Confirm", "Complete"]}
      {activeStep}
      fulfilledTextClass="text-gray-100"
      lineBorderClass="border-gray-400"
    />

    {#if activeStep == UndepositSteps.Confirm}
      <Input
        type="number"
        on:input={({ detail }) => {
          calcPricePromise = calculatePrice(detail);
        }}
        debounce
      >
        <span slot="label">Enter the number of units to undeposit:</span>
      </Input>

      {#if calcPricePromise}
        <div>
          {#await calcPricePromise}
            Getting price...
          {:then result}
            {#if result == false}
              <div class="flex flex-row gap-x-3">
                <span>Amount exceeds the limit</span>
              </div>
            {:else}
              <div class="flex flex-row gap-x-3">
                <span
                  >Price: {Number(
                    (+formatUnits(result._units, data.token.decimals)).toFixed(
                      4
                    )
                  )}
                  {data.token.symbol}</span
                >
              </div>
            {/if}
          {/await}
        </div>
      {/if}
      <span>Confirm your Undeposit.</span>
      <Modal
        show={$modal2}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(38,38,38, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button disabled={!priceConfirmed} on:click={showModal}>Confirm</Button>
      </Modal>
    {/if}

    {#if activeStep == UndepositSteps.Complete}
      <span>Undeposit confirmed!</span>
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
