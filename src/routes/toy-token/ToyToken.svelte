<script lang="ts">
  import { signer } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import { validateFields } from "../../utils";
  import { addressValidate, required } from "../../validation";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  // import HumanReadable from "$components/FriendlySource/HumanReadable.svelte";
  import {
    EmissionsERC20,
    type ERC20Config,
    type StateConfig,
    type EmissionsERC20DeployArgs,
    EmissionsERC20JSVM,
  } from "rain-sdk";
  import { parseEther } from "ethers/lib/utils";
    import Parser from "$components/parser/Parser.svelte";
    import OpDocs from "$components/parser/OpDocs.svelte";
    import { OpMeta } from "$components/parser/opmeta";
    import Label from "$routes/toy-token/Label.svelte";
    import Info from "$routes/toy-token/Info.svelte";
    import Section from "$routes/toy-token/Section.svelte";
    import SectionHeading from "$routes/toy-token/SectionHeading.svelte";
    import SectionBody from "$routes/toy-token/SectionBody.svelte";
    import Item from "$routes/toy-token/Item.svelte";
    import { writable, type Writable } from "svelte/store";
    import IconLibrary from "$components/IconLibrary.svelte";

  let deployPromise;

  let fields: any = {};

  let erc20name = "EmissionsTKN";
  let erc20symbol = "eTKN";
  let initSupply
  let ownerAddress

  let parserVmStateConfig: Writable<StateConfig> = writable(null)
  let newEmissionsERC20
  let simulatedResult

  $: if ($parserVmStateConfig && $signer) simulate()

  const simulate = async () => {
    console.log($parserVmStateConfig)
    simulatedResult = null
    if ($parserVmStateConfig?.sources[0].length) {
      const simulator = new EmissionsERC20JSVM($parserVmStateConfig, {signer: $signer})
      simulatedResult = await simulator.run()
    }
  }

  const deployEmissions = async (fieldValues) => {
    // const { validationResult, fieldValues } = await validateFields(fields);

    // GET THE SOURCE

    const vmStateConfig = $parserVmStateConfig;

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

<div class="flex gap-x-3 relative">
  <div class="flex w-2/3 flex-col gap-y-6 p-8">
    <span class="text-3xl font-semibold mb-3">Create a Toy Token</span>
    <div class="mb-2 flex flex-col w-full">
      <Info>Create a token and your friends and can come and mint it. You set the rules of who can mint and how much they can mint. Here are some games you might want to play:</Info>
      <div>example expressions...</div>
    </div>
    <Section>
      <SectionHeading>Contract</SectionHeading>
      <SectionBody>
        <Item>
          <Label>Name</Label>
          <Info>Emissions</Info>
        </Item>
        <Item>
          <Label>Source</Label>
          <Info>Rain</Info>
        </Item>
        <Item>
          <Label>Token</Label>
          <Info>ERC20</Info>
        </Item>
        <Item>
          <Label>Contract details</Label>
          <Info>Mint a new ERC20 which releases new supply whenever a valid claim is made. We script the claim step, and each wallet trying to claim needs to be meet the criteria to mint their ERC20s. In this way claiming criteria can implicitly set a total supply cap, wallet supply cap and more. Can be used for game credits, project tokens, rewards.</Info>
        </Item>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Expressions (1)</SectionHeading>
      <SectionBody>
        <span class="text-xl font-semibold">Claimable amount expression</span>
          <div class="max-w-prose">This expression will be evaluated every time the claim function is called to determine how much of this ERC20 the wallet can mint (if anything).</div>
          
          <div class="flex flex-row gap-x-2 items-center text-white bg-gray-700 rounded-lg self-start p-3 max-w-prose">
            <IconLibrary width={30} icon="tip" />
            <div class="max-w-prose">Remember - this is totally unique to your copy of Toy Token and gets evaluated as part of the claim function.</div>
          </div>
          
          <div class="grid grid-cols-7 gap-4 items-stretch">
            <div class="col-span-4 flex flex-col gap-y-4">
              <Parser vmStateConfig={parserVmStateConfig} />
            </div>
            <div class="col-span-3">
              <div class="bg-yellow-200 rounded-lg p-4 h-full">

                <div class="font-mono text-black text-sm">
                  <span>Simulated output: </span>
                  <span>
                    {#if $signer}
                      {#if simulatedResult}
                        {simulatedResult?.toString()}
                      {:else}
                        Invalid expression
                      {/if}
                    {:else}
                      Connect your wallet to simulate your expression
                    {/if}
                  </span>
                </div>
              </div>
            </div>
          </div>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Configuration (4)</SectionHeading>
      <SectionBody>
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
            <span slot="label">Address to immediately mint token for</span>
          </Input>
          <Input
            type="number"
            bind:this={fields.initSupply}
            bind:value={initSupply}
            validator={required}
          >
            <span slot="label">Amount of the token to immediately mint</span>
          </Input>
        </div>
      </SectionBody>
    </Section>

    <div class="self-start">
        <Button shrink on:click={handleClick}>Deploy EmissionsERC20</Button>
      {#if deployPromise}
      <div class="p-4">
        <ContractDeploy {deployPromise} type="Toy Token" />
      </div>
      {/if}
    </div>
  </div>
  <div class="flex w-1/3 flex-col gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-600">
        <!-- <FormPanel heading="Human Readable Source">
          <HumanReadable
            signer={$signerAddress}
            contractType="emissions"
            {FriendlySource}
          />
        </FormPanel> -->
          <OpDocs {OpMeta} />
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
