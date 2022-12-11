<script lang="ts">
  import { signer } from "svelte-ethers-store";
  import { formatUnits, Logger, parseUnits } from "ethers/lib/utils";
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import Input from "$components/Input.svelte";
  import { selectedNetwork } from "$src/stores";
  import { addressValidate, required } from "$src/validation";
  import { ethers } from "ethers";
  import erc20ABI from "./erc20ABI.json" 
    import { formatAddress } from "$src/utils";

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

  export let token, orderBookContract
  let units,
    activeStep = DepositSteps.Approve,
    txStatus = TxStatus.None,
    priceConfirmed = PriceConfirmed.Pending,
    txReceipt,
    errorMsg,
    calcPricePromise

  const calculatePrice = async (amount) => {
    priceConfirmed = PriceConfirmed.Pending;
    const one = parseUnits("1", token?.tokenVault?.token.decimals.toString());
    const _units = parseUnits(
      amount.toString(),
      token?.tokenVault?.token.decimals.toString()
    );
    units = _units;

    priceConfirmed = PriceConfirmed.Confirmed;

    return {
      _units,
    };
  };

  const approve = async () => {
    
    let tokenContract = new ethers.Contract(token?.tokenVault?.token.id, erc20ABI, $signer )

    let tx;
    txStatus = TxStatus.AwaitingSignature;
    try {
      tx = await tokenContract.approve(orderBookContract.address, units);  

      txStatus = TxStatus.AwaitingConfirmation;
      const txReceipt = await tx.wait();
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
        console.log("error : " , error)
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
    activeStep = DepositSteps.Confirm;

    return txReceipt;
  };

  const Deposit = async () => {
    let tx;
    txStatus = TxStatus.AwaitingSignature;
    let vaultId = ethers.BigNumber.from(token?.tokenVault?.vaultId);
    const depositConfigStruct = {
      token: token?.tokenVault?.token.id ,
      vaultId: vaultId,
      amount: units
    }; 
    
    try {
      tx = await orderBookContract.deposit(depositConfigStruct);

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
    activeStep = DepositSteps.Complete;
  };
</script>

{#if txStatus == TxStatus.None}
  <div class="flex w-full flex-col items-start gap-y-7">
    <span class="text-xl font-bold">Deposit</span>
    <Steps
      steps={["Approve", "Confirm", "Complete"]}
      {activeStep}
      bgColor={true}
      fulfilledTextClass="text-black font-semibold"
      lineBorderClass="border-gray-400"
    />
    <span class="text-red-500">Don't Close the Modal until transaction complete</span>
    {#if activeStep == DepositSteps.Approve}
      <!-- <Input
        type="address"
        bind:value={token?.tokenVault?.token.id}
        from="depositModal"
        validator={addressValidate}
      >
        <span slot="label">Enter token:</span>
      </Input> -->
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
        <div>
          {#await calcPricePromise}
            Getting price...
          {:then result}
            <div class="flex flex-row gap-x-3">
              <span
                >Amount: {formatUnits(result._units, token?.tokenVault?.token.decimals)}
                {token?.tokenVault?.token.symbol}
              </span>
            </div>
          {/await}
        </div>
      {/if}

      <!-- <Button bRadius="rounded-full" variant="bg-orange-400" disabled={!priceConfirmed} on:click={approve}>Approve Amount</Button> -->
      <button 
        class="w-full rounded-full text-base py-2 px-28 text-black" 
        style="background-color: #FDB142;" 
        disabled={!priceConfirmed} 
        on:click={approve}>Approve Amount
      </button>
    {/if}
    {#if activeStep == DepositSteps.Confirm}
      <span>Confirm your deposit.</span>
      {#if calcPricePromise}
        <div class="grid grid-cols-2 gap-4 rounded-md border border-gray-600 p-4">
          {#await calcPricePromise}
            Getting price...
          {:then result}
            <span>OrderBook Address:</span>
            <span>{formatAddress(orderBookContract.address)}</span>

            <span>Token Address:</span>
            <span>{formatAddress(token?.tokenVault?.token.id)}</span>

            <span>Amount:</span>
            <span>{formatUnits(result._units, token?.tokenVault?.token.decimals)}
              {token?.tokenVault?.token.symbol}
            </span>
          {/await}
        </div>
      {/if}

      <!-- <Button
        bRadius="rounded-full"
        variant="bg-orange-400"
        disabled={!priceConfirmed}
        on:click={Deposit}
      > -->
      <button 
        class="w-full rounded-full text-base py-2 px-28 text-black" 
        style="background-color: #FDB142;" 
        disabled={!priceConfirmed} 
        on:click={Deposit}>Deposit
      </button>
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
    <!-- <Ring color="#fff" /> -->
    <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 200px;" loop autoplay></lottie-player>
    <span class="text-lg">Awaiting signature...</span>
  </div>
{/if}
{#if txStatus == TxStatus.AwaitingConfirmation}
  <div class="flex flex-col items-center gap-y-5 p-6">
    <!-- <Ring color="#fff" /> -->
    <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 300px; height: 200px;" loop autoplay></lottie-player>
    <span class="text-lg">Transaction confirming...</span>
  </div>
{/if}
{#if txStatus == TxStatus.Error}
  <div class="flex flex-col items-center gap-y-5 p-6">
    <span class="text-lg">Something went wrong.</span>
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