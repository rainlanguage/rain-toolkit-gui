<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import { formatUnits, Logger, parseUnits } from "ethers/lib/utils";
  import Button from "$components/Button.svelte";
  import Steps from "$components/steps/Steps.svelte";
  import Ring from "$components/Ring.svelte";
  import Input from "$components/Input.svelte";
  import { selectedNetwork } from "$src/stores";
  import { addressValidate, required } from "$src/validation";
  import { BigNumber, ethers } from "ethers";
  import erc20ABI from "./erc20ABI.json" 
  import { formatAddress } from "$src/utils";
  import * as Sentry from "@sentry/svelte";
  import { onMount } from "svelte";
    import IconLibrary from "$components/IconLibrary.svelte";

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
    calcPricePromise,
    tokenContract,
    approved,
    allowance

  onMount(() => {
    tokenContract = new ethers.Contract(token?.tokenVault?.token.id, erc20ABI, $signer)
    // const checkBalanace = async () =>{
    //   return await tokenContract.balanceOf($signerAddress?.toLowerCase())
    // }
    // checkBal = checkBalanace()

    const checkApproval = async () => {
      

    };
    checkApproval()
  })

  const calculatePrice = async (amount) => {

    priceConfirmed = PriceConfirmed.Pending;
    const one = parseUnits("1", token?.tokenVault?.token.decimals.toString());
    const _units = parseUnits(
      amount.toString(),
      token?.tokenVault?.token.decimals.toString()
    );
    console.log("val", tokenContract);
    
    units = _units;
    allowance = await tokenContract.allowance($signerAddress.toLowerCase(), orderBookContract.address);
    console.log("allowance.gte(BigNumber.from(_units)", allowance.toString(), allowance.gte(BigNumber.from(_units)));
    
    if(allowance.gte(BigNumber.from(_units))){
      activeStep = DepositSteps.Confirm;
      priceConfirmed = PriceConfirmed.Confirmed;
      return {
        _units,
      };
    }else{
      // units = BigNumber.from(_units).sub(allowance);
      priceConfirmed = PriceConfirmed.Confirmed;
      return {
        _units,
      };
    }
  };

  const approve = async () => {

    let tx;
    txStatus = TxStatus.AwaitingSignature;
    try {
      tx = await tokenContract.approve(orderBookContract.address, units);  
      txStatus = TxStatus.AwaitingConfirmation;
      const txReceipt = await tx.wait();
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
        errorMsg = error.error?.data?.message ||
          error.error?.message ||
          error.data?.message ||
          error?.message || 
          error?.code 
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
    activeStep = DepositSteps.Complete;
  };
</script>

{#if txStatus == TxStatus.None}
    <!-- {#if checkBal}
      {#await checkBal}
      <lottie-player src="https://lottie.host/5f90529b-22d1-4337-8c44-46e3ba7c0c68/pgMhlFIAcQ.json" background="transparent" speed="1" style="width: 250px; height: 250px;" loop autoplay></lottie-player>
        <div class="display flex justify-center items-center gap-y-4">Checking signer balance...</div> 
      {:then result}
        {#if result.toString() != '0'} -->
          <div class="flex w-full flex-col items-start gap-y-7">
            <span class="text-xl text-black font-bold">Deposit</span>
            <Steps
              steps={["Approve", "Confirm", "Complete"]}
              {activeStep}
              bgColor={true}
              fulfilledTextClass="text-black font-semibold text-sm"
              unfulfilledTextClass = "text-gray-500 text-sm font-semibold"
              lineBorderClass="border-gray-400"
            />
            <!-- <span class="text-red-500">Don't Close the Modal until transaction complete</span> -->
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
                      <span class="text-black"
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
                style="background-color: #FDB142;  box-shadow: inset 0px 2px 6px 0px #ffffff;"
                disabled={!priceConfirmed} 
                on:click={approve}>Approve Amount
              </button>
            {/if}
            {#if activeStep == DepositSteps.Confirm}
              <span class="text-black">Confirm your deposit.</span>
              {#if calcPricePromise}
                <div class="grid grid-cols-2 gap-4 rounded-md border border-gray-600 p-4 text-black">
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
                style="background-color: #FDB142;  box-shadow: inset 0px 2px 6px 0px #ffffff;"
                disabled={!priceConfirmed} 
                on:click={Deposit}>Deposit
              </button>
            {/if}

            {#if activeStep == DepositSteps.Complete}
              <span class="text-black">Deposit confirmed!</span>
              <a
                class="text-blue-400 underline"
                target="_blank"
                href={`${$selectedNetwork.blockExplorer}/tx/${txReceipt?.transactionHash}`}
              >
                See transaction.
              </a>
            {/if}
          </div>
        <!-- {:else}
          <div class="display flex flex-col items-center gap-y-4">
            <IconLibrary icon="close" width={64} color="text-red-500" />
            <div class="text-xl">Oops...</div>
            <span class="text-red-500">Insufficient Balance for deposit</span>
          </div>
        {/if} 
      {/await}
    {/if} -->
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