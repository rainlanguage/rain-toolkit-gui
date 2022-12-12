<script lang="ts">
	import { client } from './../stores';
  import type { Contract, ContractReceipt } from "ethers";
  import { Logger } from "ethers/lib/utils";
  import { selectedNetwork } from "$src/stores";
  import NewAddress from "./NewAddress.svelte";
  import Ring from "./Ring.svelte";
  import { AddressBook } from "rain-sdk";
  import { gql } from '@urql/svelte';
  import { getContext, onDestroy } from 'svelte';

  const { close } = getContext('simple-modal') 

  const addresses = AddressBook.getAddressesForChainId(
    parseInt($selectedNetwork.config.chainId)
  );

  export let deployPromise: Promise<Contract>;
  export let confirmedCallback:(any)=>any = ()=>{}
  export let type: string;
  export let contractKey: string
  let errorMsg,
    err = false,
    isReceipt = false,
    indexed = false,
    interval

  let contractAddress;

  const checkForIndexing = (contractAddress: string) => {
    const query = gql(`
        query ($contractAddress: Bytes!) {
          ${contractKey} (id:$contractAddress) {
            id
          }
        }
      `)

    interval = setInterval(()=>{
      $client.query(query, {contractAddress: contractAddress.toLowerCase()}, {requestPolicy: 'network-only'}).toPromise().then(res => {
        if(res.data?.[contractKey]) {
          indexed = true
          clearInterval(interval)
          confirmedCallback(contractAddress)
          close();
        }
      })
    }, 2000)
  }

  deployPromise
    .then((receipt) => {
      isReceipt = true;
      contractAddress = receipt.address;
      checkForIndexing(contractAddress)
    })
    .catch(async (error) => {
      if (error.code === Logger.errors.TRANSACTION_REPLACED) {
        if (error.cancelled) {
          errorMsg = "Transaction Cancelled";
          err = true;
          return;
        } else {
          isReceipt = true;
          const eventObjs = error.receipt.logs.filter(
            (e) =>
              e.topics[0] ==
                "0x7da70c4e5387d7038610b79ca7d304caaef815826e51e67cf247135387a79bce" &&
              (e.address === addresses.saleFactory ||
                e.address === addresses.combineTierFactory ||
                e.address === addresses.emissionsERC20Factory ||
                e.address === addresses.erc20BalanceTierFactory ||
                e.address === addresses.erc20TransferTierFactory ||
                e.address === addresses.erc721BalanceTierFactory ||
                e.address === addresses.gatedNFTFactory ||
                e.address === addresses.noticeBoard ||
                e.address === addresses.redeemableERC20Factory ||
                e.address === addresses.verifyFactory ||
                e.address === addresses.verifyTierFactory)
          );

          contractAddress =
            "0x" +
            eventObjs[0].data.substring(2).substring(64).replace(/^0+/, "");
          // txReceipt = await error.replacement.wait();
        }
      } else {
        errorMsg =
          error.error?.data?.message ||
          error.error?.message ||
          error.data?.message ||
          error?.message;
        err = true;
        return;
      }
    });

    onDestroy(()=>{
      clearInterval(interval)
    })
</script>

<div class="flex flex-col gap-y-2">
  {#if !indexed}
  {#await deployPromise}
    <div class="flex flex-row gap-x-4 items-center">
      <Ring color="#FFFFFF" />
      <span class="text-lg">
        Deploying new {type}...
      </span>
    </div>
  {:then}
  <div class="flex flex-row gap-x-4 items-center">
    <Ring color="#FFFFFF" />
    <span class="text-lg">
      Waiting on indexer...
    </span>
  </div>
  {/await}
  {/if}
  {#if indexed}
    <span class="text-lg font-semibold">New {type} deployed!</span>
    <div class="flex flex-row items-center gap-x-2">
      <span>Save to library: </span><NewAddress
        address={contractAddress}
        {type}
      />
    </div>
    <span>
      <a
        target="_blank"
        class="underline"
        href={`${$selectedNetwork.blockExplorer}/address/${contractAddress}`}
      >
        View contract on block explorer
      </a>
    </span>
  {/if}
  {#if err}
    <div class="text-red-400">{errorMsg}</div>
  {/if}
</div>
