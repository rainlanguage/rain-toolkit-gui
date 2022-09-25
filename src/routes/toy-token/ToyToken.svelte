<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import Select from "$components/Select.svelte";
  import { validateFields } from "../../utils";
  import { addressValidate, required } from "../../validation";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  // import HumanReadable from "$components/FriendlySource/HumanReadable.svelte";
  import {
    EmissionsERC20,
    type ERC20Config,
    type StateConfig,
    type EmissionsERC20DeployArgs,
    type EmissionsConfig,
    LinearEmissions,
    SequentialEmissions,
  } from "rain-sdk";
  import { parseEther, parseUnits } from "ethers/lib/utils";
    import Parser from "$components/parser/Parser.svelte";
    import OpDocs from "$components/parser/OpDocs.svelte";
    import { OpMeta } from "$components/parser/opmeta";
    import Label from "$routes/toy-token/Label.svelte";
    import Info from "$routes/toy-token/Info.svelte";
    import Section from "$routes/toy-token/Section.svelte";
    import SectionHeading from "$routes/toy-token/SectionHeading.svelte";

  let deployPromise;

  let fields: any = {};

  let erc20name = "EmissionsTKN";
  let erc20symbol = "eTKN";
  let initSupply
  let ownerAddress

  let parserVmStateConfig: StateConfig
  let newEmissionsERC20

  const deployEmissions = async (fieldValues) => {
    // const { validationResult, fieldValues } = await validateFields(fields);

    // GET THE SOURCE

    const vmStateConfig = parserVmStateConfig;

    let erc20Config: ERC20Config;
    erc20Config = {
      name: fieldValues.erc20name,
      symbol: fieldValues.erc20symbol,
      distributor: fieldValues.ownerAddress,
      initialSupply: parseEther(fieldValues.initSupply.toString()),
    };

    let emissionsDeployArg: EmissionsERC20DeployArgs;
    emissionsDeployArg = {
      allowDelegatedClaims: false,
      erc20Config,
      vmStateConfig,
    };

    newEmissionsERC20 = await EmissionsERC20.deploy(
      $signer,
      emissionsDeployArg
    );

    return newEmissionsERC20;
  };

  const handleClick = async () => {
    const { validationResult, fieldValues } = await validateFields(fields);
    if (!validationResult) return;
    deployPromise = deployEmissions(fieldValues);
  };
</script>

<div class="flex gap-x-3 mx-auto container">
  <div class="flex w-2/3 flex-col">
    <span class="text-3xl font-semibold mb-3">Create a Toy Token</span>
    <div class="mb-2 flex flex-col w-full">
      <Label>Type</Label>
      <Info>Game</Info>
      <Label>Rules</Label>
      <Info>Create a token and your friends and can come and mint it. You set the rules of who can mint and how much they can mint. Here are some games you might want to play:</Info>
      <div>example expressions...</div>
    </div>

    <SectionHeading>Contract</SectionHeading>
    <div class="mb-2 flex flex-col w-full">
      <Label>Name</Label>
      <Info>Emissions</Info>
      <Label>Source</Label>
      <Info>Rain</Info>
      <Label>Token</Label>
      <Info>ERC20</Info>
      <Label>Contract details</Label>
      <Info>Mint a new ERC20 which releases new supply whenever a valid claim is made. We script the claim step, and each wallet trying to claim needs to be meet the criteria to mint their ERC20s. In this way claiming criteria can implicitly set a total supply cap, wallet supply cap and more. Can be used for game credits, project tokens, rewards.</Info>
    </div>

    <Section>
      <SectionHeading>Expressions (1)</SectionHeading>
      <span class="text-xl  mb-2">Claimable amount expression</span>
      <div class="grid grid-cols-7 gap-x-6">
        <div class="col-span-4 flex flex-col gap-y-4">
          <div>This expression will be evaluated every time the claim function is called to determine how much of this ERC20 the wallet can mint (if anything).</div>
          <Parser bind:vmStateConfig={parserVmStateConfig} />
        </div>
        <div class="col-span-3">
          <div>Remember - this is totally unique to your copy of Toy Token and gets evaluated as part of the claim function.</div>
        </div>
      </div>
    </Section>

    <Section>
      <SectionHeading>Configuration (2)</SectionHeading>
      <div class="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Name"
          bind:this={fields.erc20name}
          bind:value={erc20name}
          validator={required}
        >
          <span slot="label">Name</span>
        </Input>
        <Input
          type="text"
          placeholder="Symbol"
          bind:this={fields.erc20symbol}
          bind:value={erc20symbol}
          validator={required}
        >
          <span slot="label">Symbol</span>
        </Input>
        <Input
          type="address"
          placeholder="Name"
          bind:this={fields.ownerAddress}
          bind:value={ownerAddress}
          validator={addressValidate}
        >
          <span slot="label">Address to mint eTKN for</span>
        </Input>
        <Input
          type="number"
          bind:this={fields.initSupply}
          bind:value={initSupply}
          validator={required}
        >
          <span slot="label">Amount of eTKN to mint</span>
        </Input>
      </div>
    </Section>

      <FormPanel>
        {#if !deployPromise}
          <Button shrink on:click={handleClick}>Deploy EmissionsERC20</Button>
        {:else}
          <ContractDeploy {deployPromise} type="EmissionsERC20" />
        {/if}
      </FormPanel>
  </div>
  <div class="flex w-1/3 flex-col gap-y-4">
      <span class="sticky">
        <!-- <FormPanel heading="Human Readable Source">
          <HumanReadable
            signer={$signerAddress}
            contractType="emissions"
            {FriendlySource}
          />
        </FormPanel> -->
        <div class="h-screen">
          <OpDocs {OpMeta} />
        </div>
      </span>
  </div>
</div>

<style>
  span.sticky {
    margin-top: 80px;
    float: right;
    position: sticky;
    top: 90px;
    padding: 5px;
  }
</style>
