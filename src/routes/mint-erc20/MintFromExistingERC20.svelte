<script lang="ts">
  import { BigNumber, ethers, providers, Signer } from "ethers";
  import { formatUnits, hexlify } from "ethers/lib/utils";
  import { signer, signerAddress, provider } from "svelte-ethers-store";
  import { push } from "svelte-spa-router";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import TokenInfo from "../sale/TokenInfo.svelte";
  import { EmissionsERC20 } from "rain-sdk";
  import { getERC20 } from "$src/utils";
  import { tierReport } from "../../utils";
  import { queryStore } from "@urql/svelte";
  import { client } from "$src/stores";
  import { selectedNetwork } from "$src/stores";
  import { addressValidate } from "$src/validation";

  export let params: {
    wild: string;
  };

  let erc20Contract, token;
  let errorMsg, erc20Address;
  let showMint, showClaim, isFaucet;
  let initPromise,
    calcMintPromise,
    mintPromise,
    calcClaimPromise,
    claimPromise,
    emissionAddress;
  let currentTimestamp, claimedTimestamp, parsedReport, claimableTimestamp;
  let claimantAddress = $signerAddress;

  $: if (params.wild || $signer) {
    initPromise = initContract();
    emissionAddress = params.wild;
  }

  $: emissionQuery = queryStore({
    client: $client,
    query: `
        query($emissionAddress: Bytes!){
          emissionsERC20(id : $emissionAddress) {
            id
            address
            deployBlock
            deployTimestamp
            deployer
            name
            symbol
            totalSupply
            decimals
            claims{
              id
              sender
              block
              timestamp
              amount
            }
            calculateClaimStateConfig {
              id
              sources
              constants
            }
          }
        }`,
    variables: { emissionAddress },
    requestPolicy: "network-only",
  });

  $: emission =
    !$emissionQuery?.fetching && $emissionQuery?.data?.emissionsERC20
      ? $emissionQuery.data.emissionsERC20
      : undefined;

  const faucetData = async () => {
    currentTimestamp = Math.floor(Date.now() / 1000);
    claimedTimestamp = parsedReport[0];

    isFaucet =
      emission?.calculateClaimStateConfig.sources[0] ===
      "0x0000020019000001000211001000020029000004220220021b000005000318001800";

    claimableTimestamp =
      claimedTimestamp +
      Number(emission?.calculateClaimStateConfig.constants[2]);
  };

  $: if (emission) {
    faucetData();
  }

  const initContract = async () => {
    if (ethers.utils.isAddress(params.wild || "")) {
      erc20Contract = new EmissionsERC20(params.wild, $signer);
      token = await getERC20(params.wild, $signer, $signerAddress);
      const report = await erc20Contract.report($signerAddress, []);
      console.log(report);
      parsedReport = tierReport(report.toHexString());
      console.log(parsedReport);
      faucetData();
    } else if (params.wild) {
      errorMsg = "Not a valid contract address";
    }
  };

  const calculateClaim = async () => {
    const claim = (await erc20Contract.calculateClaim(
      claimantAddress
    )) as BigNumber;

    if (!claim.isZero()) {
      showMint = true;
    } else {
      showMint = false;
    }
    return claim;
  };

  const calculateClaimFaucet = async () => {
    const claim = (await erc20Contract.calculateClaim(
      claimantAddress
    )) as BigNumber;

    if (!claim.isZero()) {
      showClaim = true;
    } else {
      showClaim = false;
    }
    return claim;
  };

  const claim = async () => {
    const tx = await erc20Contract.claim(
      claimantAddress,
      ethers.constants.AddressZero
    );
    return await tx.wait();
  };
</script>

<div class="flex w-full max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl">Mint from an already deployed ERC20 token</span>
  </div>

  {#if !params.wild}
    <FormPanel>
      <span class="text-gray-400">Enter the ERC20 address below</span>
      <Input
        bind:value={erc20Address}
        type="address"
        placeholder="Contract address"
        validator={addressValidate}
      >
        <span slot="description">Only the owner of the token can mint</span>
      </Input>
      <Button
        on:click={() => {
          push(`/erc20/mint/${erc20Address}`);
        }}
      >
        Load
      </Button>
    </FormPanel>
  {:else if errorMsg}
    <span class="text-red-400">{errorMsg}</span>
  {/if}

  {#if initPromise}
    {#await initPromise && emission}
      Loading...
    {:then}
      {#if token && emission}
        <FormPanel heading="ERC20 Token Details">
          <TokenInfo
            tokenData={{
              name: token.erc20name,
              symbol: token.erc20symbol,
              decimals: token.erc20decimals,
              id: erc20Contract.address,
              totalSupply: token.erc20totalSupply,
            }}
          />
        </FormPanel>

        {#if BigInt(emission?.calculateClaimStateConfig?.constants[0]) == BigInt($signerAddress)}
          <FormPanel heading="Mint">
            {#if !showMint}
              <div class="flex flex-col gap-y-4">
                <span class="text-gray-400"
                  >Show mintable amount for {$signerAddress}</span
                >
                <Button
                  on:click={() => {
                    calcMintPromise = calculateClaim();
                  }}
                >
                  Show
                </Button>
              </div>
            {/if}
            {#if calcMintPromise}
              <div>
                {#await calcMintPromise}
                  Getting eligible mint...
                {:then claim}
                  Mintable amount will be {formatUnits(
                    claim,
                    token.erc20decimals
                  )}
                  {token.erc20symbol}
                {:catch err}
                  <span class="text-lg text-red-400">{err.error.message}</span>
                {/await}
              </div>
            {/if}

            {#if showMint}
              <Button
                shrink
                on:click={() => {
                  mintPromise = claim();
                }}>Mint</Button
              >
              {#if mintPromise}
                {#await mintPromise}
                  Minting...
                {:then}
                  Mint complete! Refresh to see your new balance.
                {/await}
              {/if}
            {/if}
          </FormPanel>
        {/if}

        {#if isFaucet}
          <FormPanel heading="Claim your Faucet">
            {#if !showClaim}
              <Input
                type="address"
                placeholder="Name"
                bind:value={claimantAddress}
                validator={addressValidate}
              >
                <span slot="label">Claimant Address</span>
              </Input>
              <Button
                on:click={() => {
                  calcClaimPromise = calculateClaimFaucet();
                }}
              >
                Show
              </Button>
            {/if}

            {#if calcClaimPromise}
              {#if claimableTimestamp >= currentTimestamp}
                <span class="text-red-400"
                  >You will not be able to make another claim until block
                  <a
                    class="text-blue-400 underline"
                    target="_blank"
                    href={`${$selectedNetwork.blockExplorer}/block/${claimableTimestamp}`}
                  >
                    {claimableTimestamp}
                  </a>.
                </span>
                <span class="text-red-400">
                  You have to wait
                  <span class="text-white"
                    >{claimableTimestamp - currentTimestamp}</span
                  > blocks</span
                >
              {:else}
                <div>
                  {#await calcClaimPromise}
                    Getting eligible mint...
                  {:then claim}
                    Mintable amount will be {formatUnits(
                      claim,
                      token.erc20decimals
                    )}
                    {token.erc20symbol}
                  {:catch err}
                    <span class="text-lg text-red-400">{err.error.message}</span
                    >
                  {/await}
                </div>
              {/if}
            {/if}

            {#if showClaim && claimableTimestamp <= currentTimestamp}
              <Button
                shrink
                on:click={() => {
                  claimPromise = claim();
                }}>Claim</Button
              >
              {#if claimPromise}
                {#await claimPromise}
                  Minting...
                {:then}
                  Mint complete! Refresh to see your new balance.
                {/await}
              {/if}
            {/if}
          </FormPanel>
        {/if}
      {/if}
    {/await}
  {/if}
</div>
