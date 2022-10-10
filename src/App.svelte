<script lang="ts" type="module">
  import Home from "./routes/Home.svelte";
  import Header from "./layout/Header.svelte";
  import Sidebar from "./layout/Sidebar.svelte";
  import Footer from "./layout/Footer.svelte";

  import { signer } from "svelte-ethers-store";
  import Router from "svelte-spa-router";
  import Modal from "svelte-simple-modal";

  //ERC721BalanceTier
  import Deploy721BalanceTier from "./routes/erc721-balance-tier/Deploy721BalanceTier.svelte";
  import ListERC721BalanceTier from "./routes/erc721-balance-tier/ListERC721BalanceTier.svelte";
  import ERC721BalanceTierReport from "./routes/erc721-balance-tier/ERC721BalanceTierReport.svelte";

  //ERC20BalanceTier
  import DeployBalanceTier from "./routes/erc20-balance-tier/DeployBalanceTier.svelte";
  import BalanceTierReport from "./routes/erc20-balance-tier/BalanceTierReport.svelte";
  import ListBalanceTier from "./routes/erc20-balance-tier/ListBalanceTier.svelte";

  //Combine Tier
  import DeployCombineTier from "./routes/combine-tier/DeployCombineTier.svelte";
  import CombineTierReport from "./routes/combine-tier/CombineTierReport.svelte";
  import ListCombineTier from "./routes/combine-tier/ListCombineTier.svelte";

  //Sale
  import DeploySale from "./routes/sale/DeploySale.svelte";
  import PurchaseSale from "./routes/sale/PurchaseSale.svelte";
  import ListSale from "./routes/sale/ListSale.svelte";

  // //Emissions
  import DeployEmissions from "./routes/emissions-erc20/DeployEmissions.svelte";
  import ClaimEmissions from "./routes/emissions-erc20/ClaimEmissions.svelte";

  //Verify
  import DeployVerify from "./routes/verify/DeployVerify.svelte";
  import AdministerVerify from "./routes/verify/AdministerVerify.svelte";

  //AddressLibrary
  import AddressLibrary from "./routes/address-library/AddressLibrary.svelte";

  //Stake
  import DeployStake from "./routes/stake/DeployStake.svelte";
  import StakeReport from "./routes/stake/StakeReport.svelte";
  import ListStake from "./routes/stake/ListStake.svelte";

  //Mint ERC20
  import DeployERC20 from "./routes/mint-erc20/DeployERC20.svelte";
  import MintFromExistingERC20 from "./routes/mint-erc20/MintFromExistingERC20.svelte";
  import ListErc20s from "./routes/mint-erc20/ListERC20s.svelte";
  import StakeTokens from "$routes/stake/StakeTokens.svelte";
  import ToyToken from "$routes/toy-token/ToyToken.svelte";
  import ViewToken from "$routes/toy-token/ViewToken.svelte";
  import DeployersTokens from "$routes/toy-token/DeployersToken.svelte";
  import TopDeployers from "$routes/toy-token/TopDeployer.svelte"

  
  let routes = {};

  routes = {
    // Using named parameters, with last being optional
    "/erc20balancetier/deploy": DeployBalanceTier,
    "/erc20balancetier/report/*": BalanceTierReport,
    "/erc20balancetier/list": ListBalanceTier,

    "/erc721balancetier/deploy": Deploy721BalanceTier,
    "/erc721balancetier/report/*": ERC721BalanceTierReport,
    "/erc721balancetier/list": ListERC721BalanceTier,

    "/combinetier/deploy": DeployCombineTier,
    "/combinetier/report/*": CombineTierReport,
    "/combinetier/list": ListCombineTier,

    "/stake/deploy": DeployStake,
    "/stake/stake/*": StakeTokens,
    "/stake/report/*": StakeReport,
    "/stake/list": ListStake,

    "/sale/deploy": DeploySale,
    "/sale/purchase/*": PurchaseSale,
    "/sale/list": ListSale,

    "/emissions/deploy": DeployEmissions,
    "/token/*": ViewToken,
    "/deployer/*": DeployersTokens,
    "/topdeployer": TopDeployers,

    "/verify/deploy": DeployVerify,
    "/verify/administer/*": AdministerVerify,

    "/erc20/deploy": DeployERC20,
    "/erc20/mint/*": MintFromExistingERC20,
    "/erc20/list": ListErc20s,

    "/address-library": AddressLibrary,

    "/": ToyToken,

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
  <main class="relative flex">
    <!-- <Sidebar /> -->
    <div class="w-full">
        <Router {routes} />
    </div>
  </main>
  <!-- <Footer /> -->
</Modal>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
