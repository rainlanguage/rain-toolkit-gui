<script lang="ts">
  import {
    calculatePriceConfig,
    getSaleDuration,
    getBuyWalletCap,
  } from "../../routes/sale/sale";
  import { ethers } from "ethers";
  import { arrayify, hexlify } from "ethers/lib/utils";

  import {
    HumanFriendlyRead,
    CombineTierGenerator,
    type EmissionsConfig,
    type StateConfig,
    LinearEmissions,
    SequentialEmissions,
EmissionsERC20Context,
CombineTierContext,
SaleContext,
SaleStorage,
  } from "rain-sdk";

  export let FriendlySource, signer, contractType;
  let saleConfig,
    saleDurationConfig,
    buyCapConfig,
    priceConfig,
    combineTierSource,
    emissionsSource,
    emissionsType,
    anySource,
    errorMsg,
    err = false;

  $: {
    if (contractType.toLowerCase() === "emissions") {
      try {
        emissionsType = FriendlySource.emissionsType;

        let emissionsConfig: EmissionsConfig = emissionsType.value
          ? {
              tierAddress: FriendlySource.tierAddress,
              blockTime: FriendlySource.blockTime,
              period: FriendlySource.period,
              periodicRewards: {
                tier1: FriendlySource.tier1,
                tier2: FriendlySource.tier2,
                tier3: FriendlySource.tier3,
                tier4: FriendlySource.tier4,
                tier5: FriendlySource.tier6,
                tier6: FriendlySource.tier6,
                tier7: FriendlySource.tier7,
                tier8: FriendlySource.tier8,
              },
              maxPeriodicRewards: {
                tier1: FriendlySource.maxTier1,
                tier2: FriendlySource.maxTier2,
                tier3: FriendlySource.maxTier3,
                tier4: FriendlySource.maxTier4,
                tier5: FriendlySource.maxTier6,
                tier6: FriendlySource.maxTier6,
                tier7: FriendlySource.maxTier7,
                tier8: FriendlySource.maxTier8,
              },
              numberOfIncrements: FriendlySource.numberOfIncrements,
            }
          : {
              tierAddress: FriendlySource.tierAddress,
              blockTime: FriendlySource.blockTime,
              period: FriendlySource.period,
              periodicRewards: {
                tier1: FriendlySource.tier1,
                tier2: FriendlySource.tier2,
                tier3: FriendlySource.tier3,
                tier4: FriendlySource.tier4,
                tier5: FriendlySource.tier6,
                tier6: FriendlySource.tier6,
                tier7: FriendlySource.tier7,
                tier8: FriendlySource.tier8,
              },
            };
        let vmStateConfig: StateConfig;
        if (emissionsType.value) {
          vmStateConfig = new SequentialEmissions(emissionsConfig);
        }
        if (!emissionsType.value) {
          vmStateConfig = new LinearEmissions(emissionsConfig);
        }

        emissionsSource = HumanFriendlyRead.get(vmStateConfig, {
          pretty: true,
          contextEnums: [EmissionsERC20Context[0]]
        });
      } catch (error) {
        console.log(error);

        errorMsg = error;
        err = true;
      }
    }
    if (contractType.toLowerCase() === "combinetier") {
      try {
        combineTierSource = HumanFriendlyRead.prettify(
          HumanFriendlyRead.get(
            new CombineTierGenerator(FriendlySource.tierContractOne, {
              delegatedReport: true,
              hasReportForSingleTier: true,
            }).combineWith(
              FriendlySource.tierContractTwo,
              FriendlySource.logicValue,
              FriendlySource.modeValue,
              true,
              true
            ),
            {
             pretty: true,
             contextEnums: [CombineTierContext[0], CombineTierContext[1]]
            }
          )
        );
      } catch (error) {
        errorMsg = error;
        err = true;
      }
    }
    if (contractType.toLowerCase() === "sale") {
      try {
        saleDurationConfig = HumanFriendlyRead.prettify(
          HumanFriendlyRead.get(
            getSaleDuration(FriendlySource.saleParam, signer), {
              pretty: true,
              contextEnums: [SaleContext[0]],
              storageEnums: [SaleStorage[0], SaleStorage[1], SaleStorage[2], SaleStorage[3]]
            }
          )
        );
      } catch (error) {
        console.log(error);
        saleDurationConfig = error;
      }
      if (contractType.toLowerCase() === "any") {
        if (ethers.utils.isHexString(FriendlySource.sources[0])) {
          FriendlySource.sources = FriendlySource.sources.map((source) =>
            arrayify(source)
          );
          for (let i = 0; i < FriendlySource.constants.length; i++) {
            FriendlySource.constants[i] = hexlify(
              BigInt(FriendlySource.constants[i])
            );
          }
        }
        try {
          anySource = HumanFriendlyRead.prettify(
            HumanFriendlyRead.get(FriendlySource, {
              pretty: true,
              contextEnums: [SaleContext[0]],
              storageEnums: [SaleStorage[0], SaleStorage[1], SaleStorage[2], SaleStorage[3]]
            })
          );
        } catch (error) {
          errorMsg = error;
          err = true;
        }
      }

      try {
        buyCapConfig = HumanFriendlyRead.prettify(
          HumanFriendlyRead.get(getBuyWalletCap(FriendlySource.saleParam), {
            pretty: true,
              contextEnums: [SaleContext[0]],
              storageEnums: [SaleStorage[0], SaleStorage[1], SaleStorage[2], SaleStorage[3]]
          })
        );
      } catch (error) {
        buyCapConfig = error;
      }

      try {
        priceConfig =
          FriendlySource.startTimestamp && FriendlySource.endTimestamp
            ? HumanFriendlyRead.prettify(
                HumanFriendlyRead.get(
                  calculatePriceConfig(FriendlySource.saleParam), {
                    pretty: true,
                    contextEnums: [SaleContext[0]],
                    storageEnums: [SaleStorage[0], SaleStorage[1], SaleStorage[2], SaleStorage[3]]
                  })
              )
            : "Select Sale's Start & End Date/Time To Show Price Script";
      } catch (error) {
        priceConfig = error;
      }
    }
  }
</script>

<div class="flex w-full flex-col gap-y-4">
  <div class="flex flex-col justify-between">
    {#if contractType.toLowerCase() === "sale" && !err}
      <span class="break-words pt-2 pb-2 whitespace-pre text">
        <span class="text-gray-400">Can Live Script:</span><br />
        {saleDurationConfig}
      </span>
      <span class="break-words pt-2 pb-2 whitespace-pre text">
        <span class="text-gray-400">Buy Wallet Script:</span><br />
        {buyCapConfig}
      </span>
      <span class="break-words pt-2 pb-2 whitespace-pre text">
        <span class="text-gray-400">Price Script:</span><br />
        {priceConfig}
      </span>
    {/if}
    {#if contractType.toLowerCase() === "combinetier" && !err}
      <span class="break-words pt-2 pb-2 whitespace-pre text">
        {combineTierSource}
      </span>
    {/if}
    {#if contractType.toLowerCase() === "emissions" && !err}
      <span class="break-words pt-2 pb-2 whitespace-pre text">
        {emissionsSource}
      </span>
    {/if}
    {#if contractType.toLowerCase() === "any" && !err}
      <span class="break-words pt-2 pb-2 whitespace-pre text">
        {anySource}
      </span>
    {/if}
    {#if err}
      {errorMsg}
    {/if}
  </div>
</div>

<style>
  .text {
    white-space: break-spaces;
  }
</style>
