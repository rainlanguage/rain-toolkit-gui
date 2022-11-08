<script>
  import { getContext } from "svelte";
  import { signerAddress } from "svelte-ethers-store";
  import Connect from "../components/Connect.svelte";
  import User from "../components/User.svelte";
  import WalletConnect from "../components/wallet-connect/WalletConnect.svelte";

  const { open } = getContext("simple-modal");

  const handleConnect = () => {
    // open(Connect);
  };
</script>

<!-- <div
  class="sticky top-0 z-40 flex h-16 w-full flex-row items-center justify-between px-5"
> -->
<div
  class="sticky top-0 z-30 flex h-24 w-full flex-row items-end justify-end px-5"
> 
  <div class="flex flex-row items-center pr-14 gap-x-14">
    <div>Trust Vaults</div>
    <div>How this works</div>
    <WalletConnect />
  </div>
</div>
