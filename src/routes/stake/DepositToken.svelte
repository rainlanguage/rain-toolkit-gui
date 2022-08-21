<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import { formatUnits, Logger, parseUnits } from "ethers/lib/utils";
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import Input from "$components/Input.svelte";
  import { selectedNetwork } from "$src/stores";
  import { ERC20 } from "rain-sdk";
  import { addressValidate, required } from "$src/validation";
  import SimpleTransactionModal from "$components/SimpleTransactionModal.svelte";
  import { writable } from "svelte/store";
  import Modal, { bind } from "svelte-simple-modal/src/Modal.svelte";

  const modal2 = writable(null);
  const modal3 = writable(null);

  enum TxStatus {
    None,
    AwaitingSignature,
    AwaitingConfirmation,
    Error,
  }

  enum DepositSteps {
    Approve,
    Confirm,
    Complete,
  }

  enum PriceConfirmed {
    Pending,
    Confirmed,
  }
  interface SaleData {
    cooldownDuration: string;
    token: {
      decimals: string;
      symbol: string;
    };
    reserve: {
      id: string;
      decimals: string;
      symbol: string;
    };
    saleStatus: string;
  }

  export let stakeContract, _stake;

  let units,
    tokenDecimals,
    tokenSymbol,
    activeStep = DepositSteps.Approve,
    txStatus = TxStatus.None,
    priceConfirmed = PriceConfirmed.Pending,
    txReceipt,
    errorMsg,
    rTKN,
    calcPricePromise;

  const calculatePrice = async (amount) => {
    priceConfirmed = PriceConfirmed.Pending;
    const _units = parseUnits(amount.toString(), _stake.decimals.toString());
    units = _units;

    priceConfirmed = PriceConfirmed.Confirmed;

    return {
      _units,
    };
  };

  rTKN = new ERC20(_stake.token.id, $signer);

  (async () => (tokenDecimals = await rTKN.decimals()))();
  (async () => (tokenSymbol = await rTKN.symbol()))();

  const showApproveModal = () =>
    modal2.set(
      bind(SimpleTransactionModal, {
        method: rTKN.approve,
        args: [stakeContract.address, units],
        confirmationMsg: "Amount Approved",
        func: "approve",
        returnValue,
      })
    );

  const showDepositModal = () =>
    modal3.set(
      bind(SimpleTransactionModal, {
        method: stakeContract.deposit,
        args: [units],
        confirmationMsg: "Token Deposited",
        returnValue,
      })
    );

  const returnValue = (method, receipt) => {
    txStatus = TxStatus.None;
    if (method == true) {
      activeStep = DepositSteps.Confirm;
    } else {
      activeStep = DepositSteps.Complete;
      txReceipt = receipt;
    }
  };

  // const approve = async () => {
  //   const rTKN = new ERC20(_stake.token.id, $signer);

  //   tokenDecimals = await rTKN.decimals();
  //   tokenSymbol = await rTKN.symbol();

  //   let tx;
  //   txStatus = TxStatus.AwaitingSignature;
  //   try {
  //     tx = await rTKN.approve(stakeContract.address, units);

  //     txStatus = TxStatus.AwaitingConfirmation;
  //     const txReceipt = await tx.wait();
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
  //   activeStep = DepositSteps.Confirm;

  //   return txReceipt;
  // };

  // const Deposit = async () => {
  //   let tx;
  //   txStatus = TxStatus.AwaitingSignature;
  //   try {
  //     tx = await stakeContract.deposit(units);

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
  //   activeStep = DepositSteps.Complete;
  // };
</script>

{#if txStatus == TxStatus.None}
  <div class="flex w-full flex-col items-start gap-y-7">
    <span class="text-xl font-bold">Deposit</span>
    <Steps
      steps={["Approve", "Confirm", "Complete"]}
      {activeStep}
      fulfilledTextClass="text-gray-100"
      lineBorderClass="border-gray-400"
    />

    {#if activeStep == DepositSteps.Approve}
      <Input
        type="number"
        on:input={({ detail }) => {
          calcPricePromise = calculatePrice(detail);
        }}
        debounce
        validator={required}
      >
        <span slot="label">Enter the number of units to deposit:</span>
      </Input>

      <Modal
        show={$modal2}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(38,38,38, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button on:click={showApproveModal}>Approve Amount</Button>
      </Modal>
    {/if}
    {#if activeStep == DepositSteps.Confirm}
      <span>Confirm your deposit.</span>
      <div class="flex flex-row gap-x-3">
        {#if calcPricePromise}
          <div>
            {#await calcPricePromise}
              Getting price...
            {:then result}
              <div class="flex flex-row gap-x-3">
                <span
                  >Amount: {formatUnits(result._units, tokenDecimals)}
                  {tokenSymbol}
                </span>
              </div>
            {/await}
          </div>
        {/if}
      </div>
      <Modal
        show={$modal3}
        styleContent={{ color: "rgba(249, 250, 251, 1)" }}
        styleWindow={{
          backgroundColor: "rgba(38,38,38, 1) !important",
          width: "fit-content",
        }}
        closeButton={false}
      >
        <Button disabled={!priceConfirmed} on:click={showDepositModal}
          >Deposit</Button
        >
      </Modal>
    {/if}

    {#if activeStep == DepositSteps.Complete}
      <span>Deposit confirmed!</span>
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
