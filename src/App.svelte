<script lang="ts" type="module">
  import Home from "./routes/Home.svelte";
  import Header from "./layout/Header.svelte";
  import Sidebar from "./layout/Sidebar.svelte";
  import Footer from "./layout/Footer.svelte";

  import { signer, signerAddress } from "svelte-ethers-store";
  import Router from "svelte-spa-router";
  import Modal from "svelte-simple-modal";
    
  import AddressLibrary from "$routes/address-library/AddressLibrary.svelte";
  import AddSlosh from "$routes/order-book/AddSlosh.svelte";
  import SloshBalance from "$routes/order-book/SloshBalance.svelte";
  import VaultBalance from "$routes/order-book/VaultBalance.svelte";
  import Sloshes from "$routes/order-book/Sloshes.svelte";
  import Vaults from "$routes/order-book/Vaults.svelte";
  import WalletConnect from "$components/wallet-connect/WalletConnect.svelte";
    import Orderbook from "$routes/order-book/Orderbook.svelte";
   
  let routes = {};

  routes = {

    "/address-library": AddressLibrary,

    "/": Orderbook,
    // "/addvault" : Sloshes,
    "/vaults" : Vaults,
    "/sloshes/*" : Sloshes,
    "/addslosh/*": AddSlosh,
    "/sloshbalance/*": SloshBalance,
    "/vaultbalance/*": VaultBalance,

    // Catch-all
    // This is optional, but if present it must be the last
    // '*': NotFound,
  };
</script>

<Modal
  unstyled={true}
  closeButton={false}
  classWindow="relative max-w-full max-h-full my-2 mx-auto text-white rounded-xl shadow-md bg-gray-800"
  classBg="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center bg-gray-900 bg-opacity-75 z-50 backdrop-blur"
  classWindowWrap="relative m-2 max-h-full flex flex-col"
  classContent="p-6"
>
  <Header />
    <main class="relative flex font-light text-gray-50">
      <div class="w-full py-5 px-8">
        {#if $signerAddress}
          <Router {routes} />
        {:else}
          <div class="flex flex-col justify-center items-center h-full">
            <span class="text-xl font-semibold text-black">To use the app:</span>
            <WalletConnect page={true}/>
          </div>
        {/if}
      </div>
    </main>
  <Footer />
</Modal>

<style global lang="postcss">
  /* .back{
    background: rgb(233,183,108);
    background: linear-gradient(180deg, rgba(233,183,108,1) 0%, rgba(255,238,149,1) 100%);
  } */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  main{
    z-index: 10;
    min-height: 74vh;
    background-image: url("/assets/background.svg");
    /* background-position: center; */
    background-repeat: no-repeat;
    /* background-size: cover; */
  }
</style>
