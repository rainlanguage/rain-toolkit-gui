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
    import * as Sentry from "@sentry/svelte";

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

  export let token, orderBookContract
  let errorMsg,
    units,
    isWithdraw,
    calcPricePromise,
    activeStep = WithdrawSteps.Confirm,
    txStatus = TxStatus.None,
    txReceipt,
    priceConfirmed = PriceConfirmed.Pending 

    console.log("token", token);
    
  const calculatePrice = async (amount) => { 
    priceConfirmed = PriceConfirmed.Pending;
    const one = parseUnits("1", token?.tokenVault?.token.decimals.toString());
    const _units = parseUnits(
      amount.toString(),
      token?.tokenVault?.token.decimals.toString()
    );  
    units = _units;
    
    let isWithdrawable = (ethers.BigNumber.from(token?.tokenVault?.balance).gte(_units) )
    isWithdraw = isWithdrawable
    
    priceConfirmed = PriceConfirmed.Confirmed;

    return {
      _units,
      isWithdrawable
    };
  };

  const withdraw = async () => {
    let tx;
    txStatus = TxStatus.AwaitingSignature;
    let vaultId = ethers.BigNumber.from(token?.tokenVault?.vaultId);

    const withdrawConfigStruct = {
      token: token?.tokenVault?.token.id ,
      vaultId: vaultId,
      amount: units
    }; 

    try {
      tx = await orderBookContract.withdraw(withdrawConfigStruct);

      txStatus = TxStatus.AwaitingConfirmation;
      txReceipt = await tx.wait();
    } catch (error) { 
      Sentry.captureException(error);
      if (error.code === Logger.errors.TRANSACTION_REPLACED) {
        if (error.cancelled) {
          errorMsg = "Transaction Cancelled";
          txStatus = TxStatus.Error;
          return;
        } else {
          txReceipt = await error.replacement.wait();
        }
      } else if(error.code === -32603){
        errorMsg = 'Transaction Underpriced , please try again'
        txStatus = TxStatus.Error;
        return;
      }else if(error.code == Logger.errors.ACTION_REJECTED){
                errorMsg = 'Transaction Rejected'
                txStatus = TxStatus.Error;
                return;
      }else { 
        errorMsg = error.error?.data?.message  ||
          error.error?.message ||
          error.data?.message ||
          error?.message || 
          error?.code 
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
    <span class="text-xl text-black font-bold">Withdraw</span>
    <Steps
      steps={["Confirm", "Complete"]}
      {activeStep} 
      bgColor={true}
      fulfilledTextClass="text-black font-semibold text-sm"
      unfulfilledTextClass = "text-gray-500 text-sm font-semibold"
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
        <span slot="label">Enter the number of units to withdraw:</span>
      </Input>

      {#if calcPricePromise}
        {#await calcPricePromise}
          Getting price...
        {:then result}
          {#if !result.isWithdrawable}
            <span class="text-red-500">Please Enter amount less than or equal to the Vault Balance</span>
          {:else}
            <div class="grid grid-cols-2 gap-4 rounded-md border border-gray-600 p-4 text-black">
              <span>OrderBook Address:</span>
              <span>{formatAddress(orderBookContract.address)}</span>

              <span>Token Address:</span>
              <span>{formatAddress(token?.tokenVault?.token.id)}</span>

              <span>Total Supply:</span>
              <span>{formatUnits(result._units, token?.tokenVault?.token.decimals)}
                {token?.tokenVault?.token.symbol}
              </span>
            </div>
          {/if}
        {/await}
      {/if}
    
      <span class="text-black">Confirm your withdraw.</span>
      <!-- <Button bRadius="rounded-full" variant="bg-orange-400" disabled={!priceConfirmed} on:click={withdraw}>Confirm</Button> -->
      <button 
        class="w-full rounded-full text-base py-2 px-28 text-black" 
        style="background-color: #FDB142;  box-shadow: inset 0px 2px 6px 0px #ffffff;"
        disabled={!priceConfirmed || !isWithdraw} 
        on:click={withdraw}>Confirm
      </button>
    {/if}

    {#if activeStep == WithdrawSteps.Complete}
      <span class="text-black">Withdraw confirmed!</span>
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
    <!-- <Ring color="#fff" /> -->
    <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 200px;" loop autoplay></lottie-player>
    <span class="text-lg text-black">Awaiting signature...</span>
  </div>
{/if}
{#if txStatus == TxStatus.AwaitingConfirmation}
  <div class="flex flex-col items-center gap-y-5 p-6">
    <!-- <Ring color="#fff" /> -->
    <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 200px;" loop autoplay></lottie-player>
    <span class="text-lg text-black">Transaction confirming...</span>
  </div>
{/if}
{#if txStatus == TxStatus.Error}
  <div class="flex flex-col items-center gap-y-5 p-6">
    <span class="text-lg text-black">Something went wrong.</span>
    <span class="text-lg text-red-400">{errorMsg}</span>
  </div>
{/if}

<style>
  :global(div[role=dialog]){
    background-color: #fff;
    color: #000;
  }
  button[disabled]{
    color: rgb(115 115 115);
  }
</style>