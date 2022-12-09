<script lang="ts">
  import { formatAddress } from "$src/utils";
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import { selectedNetwork } from "$src/stores";
  import { signer } from "svelte-ethers-store";
  import { formatUnits, Logger, parseUnits } from "ethers/lib/utils";
  import { required } from "$src/validation";
    import { ethers } from "ethers";
    import Input from "$components/Input.svelte";

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

  export let vault_, orderBookContract
  let errorMsg,
    units,
    calcPricePromise,
    activeStep = WithdrawSteps.Confirm,
    txStatus = TxStatus.None,
    txReceipt,
    priceConfirmed = PriceConfirmed.Pending 

  const calculatePrice = async (amount) => {
    priceConfirmed = PriceConfirmed.Pending;
    const one = parseUnits("1", vault_.token.decimals.toString());
    const _units = parseUnits(
      amount.toString(),
      vault_.token.decimals.toString()
    );
    units = _units;

    priceConfirmed = PriceConfirmed.Confirmed;

    return {
      _units,
    };
  };

  const withdraw = async () => {
    let tx;
    txStatus = TxStatus.AwaitingSignature;
    let vaultId = ethers.BigNumber.from(vault_.vaultId);

    const withdrawConfigStruct = {
      token: vault_.token.id ,
      vaultId: vaultId,
      amount: units
    }; 

    try {
      tx = await orderBookContract.withdraw(withdrawConfigStruct);

      txStatus = TxStatus.AwaitingConfirmation;
      txReceipt = await tx.wait();
    } catch (error) {
      if (error.code === Logger.errors.TRANSACTION_REPLACED) {
        if (error.cancelled) {
          errorMsg = "Transaction Cancelled";
          txStatus = TxStatus.Error;
          return;
        } else {
          txReceipt = await error.replacement.wait();
        }
      } else {
        errorMsg = error?.code ||
          error.error?.data?.message ||
          error.error?.message ||
          error.data?.message ||
          error?.message;
        txStatus = TxStatus.Error;
        return;
      }
    }

    txStatus = TxStatus.None;
    activeStep = WithdrawSteps.Complete;

    return txReceipt;
  };
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
      <Input
          type="text"
          on:input={({ detail }) => {
            calcPricePromise = calculatePrice(detail);
          }}
          debounce
          validator={required}
      >
        <span slot="label">Enter the number of units to deposit:</span>
      </Input>

      {#if calcPricePromise}
        <div class="grid grid-cols-2 gap-4 rounded-md border border-gray-600 p-4">
          {#await calcPricePromise}
            Getting price...
          {:then result}
            <span>OrderBook Address:</span>
            <span>{formatAddress(orderBookContract.address)}</span>

            <span>Token Address:</span>
            <span>{formatAddress(vault_.token.id)}</span>

            <span>Total Supply:</span>
            <span>{formatUnits(result._units, vault_.token.decimals)}
              {vault_.token.symbol}
            </span>
          {/await}
        </div>
      {/if}
    
      <span>Confirm your withdraw.</span>
      <!-- <Button bRadius="rounded-full" variant="bg-orange-400" disabled={!priceConfirmed} on:click={withdraw}>Confirm</Button> -->
      <button 
        class="w-full rounded-full text-base py-2 px-28 text-black" 
        style="background-color: #FDB142;" 
        disabled={!priceConfirmed} 
        on:click={withdraw}>Confirm
      </button>
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
