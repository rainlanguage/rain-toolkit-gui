<script lang="ts">
  import type { Contract } from "ethers";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import { getContext } from "svelte";
  import DepositModal from "./DepositModal.svelte";
  import { signer } from "svelte-ethers-store";
  import WalletConnect from "$components/wallet-connect/WalletConnect.svelte";

  const { open } = getContext("simple-modal");

  export let saleData;
  export let sale: Contract;
  let defineSigner = true;

  const connectWallet = () => {
    defineSigner = false;
  };
</script>

{#if !defineSigner && !$signer}
  <WalletConnect isSigner={false} />
{/if}

<FormPanel heading="Deposit Escrow">
  <Button
    on:click={() => {
      $signer ? open(DepositModal, { sale, saleData }) : connectWallet();
    }}>Deposit</Button
  >
</FormPanel>
