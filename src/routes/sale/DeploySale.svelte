<script lang="ts">
  import ContractDeploy from "$components/ContractDeploy.svelte";
  import { ethers } from "ethers";
  import { formatUnits } from "ethers/lib/utils";
  import { signer, signerAddress } from "svelte-ethers-store";
  import Select from "$components/Select.svelte";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import Switch from "$components/Switch.svelte";
  import { getERC20, validateFields, isTier } from "../../utils";
  import { saleDeploy, type SaleParams, selectSale } from "./sale";
  import Flatpickr from "svelte-flatpickr";
  import "flatpickr/dist/flatpickr.css";
  import SaleSmallSimulationChart from "./SaleSmallSimulationChart.svelte";
  import HumanReadable from "$components/FriendlySource/HumanReadable.svelte";
  import dayjs from "dayjs";
  import Erc20Input from "$components/Erc20Input.svelte";
  import { addressValidate, required } from "$src/validation";

  let fields: any = {};
  let deployPromise;
  let reserveErc20;
  let saleParams: SaleParams, saleParam;

  let tierError, tierDiscountError, tierCapMulError;

  // some default values for testing
  let recipient = "0xf6CF014a3e92f214a3332F0d379aD32bf0Fae929";
  let reserve = "0x25a4Dd4cd97ED462EB5228de47822e636ec3E31A";
  let startBlock = 24407548;
  let cooldownDuration = 100;
  let saleTimeout = 100;
  let minimumRaise = 1000;
  let startPrice = 10;
  let endPrice = 20;
  let name = "Raise token";
  let symbol = "rTKN";
  let initialSupply = 1000;
  let distributionEndForwardingAddress = ethers.constants.AddressZero;
  let maxWalletCap = 10;
  let minWalletCap = 3;
  let tier = "0xe30289f881ee37c51ad5678ed799677e6c3e788f";
  let minimumStatus = 0;
  let extraTimeDiscountThreshold = 5;
  let extraTimeDiscount = 25;
  let extraTime = 30;
  let extraTimeAmount = 150;
  let tierDiscountAddress = "0xe30289f881ee37c51ad5678ed799677e6c3e788f";
  let tierCapMulAddress = "0xe30289f881ee37c51ad5678ed799677e6c3e788f";

  let discountTier1 = 5,
    discountTier2 = 10,
    discountTier3 = 15,
    discountTier4 = 20,
    discountTier5 = 25,
    discountTier6 = 30,
    discountTier7 = 35,
    discountTier8 = 40;

  let capMulTier1 = 1,
    capMulTier2 = 2,
    capMulTier3 = 3,
    capMulTier4 = 4,
    capMulTier5 = 5,
    capMulTier6 = 6,
    capMulTier7 = 7,
    capMulTier8 = 8;

  let discountActTier1 = 8,
    discountActTier2 = 7,
    discountActTier3 = 6,
    discountActTier4 = 5,
    discountActTier5 = 4,
    discountActTier6 = 3,
    discountActTier7 = 2,
    discountActTier8 = 1;

  let capMulActTier1 = 8,
    capMulActTier2 = 7,
    capMulActTier3 = 6,
    capMulActTier4 = 5,
    capMulActTier5 = 4,
    capMulActTier6 = 3,
    capMulActTier7 = 2,
    capMulActTier8 = 1;

  let startTimestamp = new Date();

  let endTimestamp = new Date();

  const saleOptions = [
    { value: selectSale.fixedPrice, label: "Fixed Price" },
    { value: selectSale.vLBP, label: "vLBP" },
    { value: selectSale.increasingPrice, label: "Increasing Price" },
  ];

  let saleType: { value: number; label: string } = null;
  let maxCapCheck = false;
  let minCapCheck = false;
  let canEndCheck = false;
  let extraTimeDiscountCheck = false;
  let tierDiscountCheck = false;
  let tierDiscountActCheck = false;
  let tierCapMulCheck = false;
  let tierCapMulActCheck = false;
  let afterMinimumRaiseCheck = false;

  const getSaleParams = async () => {
    const { validationResult, fieldValues } = await validateFields(fields);
    fieldValues.startTimestamp = Math.floor(
      dayjs(startTimestamp).$d.getTime() / 1000
    );
    fieldValues.endTimestamp = Math.floor(
      dayjs(endTimestamp).$d.getTime() / 1000
    );
    fieldValues.reserveErc20 = reserveErc20;

    saleParams = {
      inputValues: fieldValues,
      saleType: saleType?.value,
      maxCapMode: maxCapCheck,
      minCapMode: minCapCheck,
      canEndMode: canEndCheck,
      extraTimeDiscountMode: extraTimeDiscountCheck,
      tierDiscountMode: tierDiscountCheck,
      tierDiscountActMode: tierDiscountActCheck,
      tierCapMulMode: tierCapMulCheck,
      tierCapMulActMode: tierCapMulActCheck,
      afterMinimumRaiseMode: afterMinimumRaiseCheck,
    };

    saleParam = saleParams;
    return { validationResult, saleParams };
  };

  $: saleVals = {
    startTimestamp: Math.floor(dayjs(startTimestamp).$d.getTime() / 1000),
    endTimestamp: Math.floor(dayjs(endTimestamp).$d.getTime() / 1000),
    startPrice,
    endPrice,
    minimumRaise,
    initialSupply,
  };

  // $: FriendlySource = {
  //   startTimestamp: Math.floor(dayjs(startTimestamp).$d.getTime() / 1000),
  //   endTimestamp: Math.floor(dayjs(endTimestamp).$d.getTime() / 1000),
  //   saleType: saleType?.value,
  //   maxCapMode: maxCapCheck,
  //   minCapMode: minCapCheck,
  //   canEndMode: canEndCheck,
  //   extraTimeDiscountMode: extraTimeDiscountCheck,
  //   tierDiscountMode: tierDiscountCheck,
  //   tierDiscountActMode: tierDiscountActCheck,
  //   tierCapMulMode: tierCapMulCheck,
  //   tierCapMulActMode: tierCapMulActCheck,
  //   afterMinimumRaiseMode: afterMinimumRaiseCheck,

  //   recipient,
  //   reserve,
  //   startBlock,
  //   cooldownDuration,
  //   saleTimeout,
  //   minimumRaise,
  //   startPrice,
  //   endPrice,
  //   name,
  //   symbol,
  //   initialSupply,
  //   distributionEndForwardingAddress,
  //   maxWalletCap,
  //   minWalletCap,
  //   tier,
  //   minimumStatus,
  //   extraTimeDiscountThreshold,
  //   extraTimeDiscount,
  //   extraTime,
  //   extraTimeAmount,
  //   tierDiscountAddress,
  //   tierCapMulAddress,
  //   discountTier1,
  //   discountTier2,
  //   discountTier3,
  //   discountTier4,
  //   discountTier5,
  //   discountTier6,
  //   discountTier7,
  //   discountTier8,
  //   capMulTier1,
  //   capMulTier2,
  //   capMulTier3,
  //   capMulTier4,
  //   capMulTier5,
  //   capMulTier6,
  //   capMulTier7,
  //   capMulTier8,
  //   discountActTier1,
  //   discountActTier2,
  //   discountActTier3,
  //   discountActTier4,
  //   discountActTier5,
  //   discountActTier6,
  //   discountActTier7,
  //   discountActTier8,
  //   capMulActTier1,
  //   capMulActTier2,
  //   capMulActTier3,
  //   capMulActTier4,
  //   capMulActTier5,
  //   capMulActTier6,
  //   capMulActTier7,
  //   capMulActTier8,

  //   saleParam: saleParam,
  // };

  // @TODO write validators
  const defaultValidator = () => {
    return true;
  };

  const handleClick = async () => {
    const { validationResult, saleParams } = await getSaleParams();

    if (!validationResult) return;
    deployPromise = deploy(saleParams);
  };

  $: if (tier) {
    const check = async () => {
      tierError = await isTier(tier, $signer, $signerAddress);
    };
    check();
  }

  $: if (tierDiscountCheck && tierDiscountAddress) {
    const check = async () => {
      tierDiscountError = await isTier(
        tierDiscountAddress,
        $signer,
        $signerAddress
      );
    };
    check();
  }

  $: if (tierCapMulCheck && tierCapMulAddress) {
    const check = async () => {
      tierCapMulError = await isTier(
        tierCapMulAddress,
        $signer,
        $signerAddress
      );
    };
    check();
  }

  const deploy = async (saleParams) => {
    return await saleDeploy($signer, $signerAddress, saleParams);
  };

  const getReserveErc20 = async () => {
    if (fields.reserve.validate()) {
      reserveErc20 = await getERC20(reserve, $signer, $signerAddress);
    }
  };

  $: if (reserve && fields?.reserve) {
    getReserveErc20();
  }

  function MaxCapHandler() {
    if (maxCapCheck) document.getElementById("capMax").style.display = "block";
    else {
      document.getElementById("capMax").style.display = "none";
      document.getElementById("tierCapMul").style.display = "none";
      tierCapMulCheck = false;
      tierCapMulActCheck = false;
    }
  }

  let value, formattedValue;

  const options = {
    enableTime: true,
  };
</script>

<div class="flex w-full gap-x-3">
  <div class="z-10 flex w-3/5 flex-col gap-y-4">
    <div class="mb-2 flex flex-col gap-y-2">
      <span class="text-2xl"> Create a new Sale. </span>
    </div>

    <FormPanel>
      <Select
        items={saleOptions}
        bind:value={saleType}
        on:change={() => {
          if (saleType.value == 2)
            document.getElementById("B").style.display = "block";
          else document.getElementById("B").style.display = "none";
        }}
      >
        <span slot="label"> Select The Sale Type: </span>
      </Select>
    </FormPanel>

    {#if saleType !== null}
      <FormPanel heading="Sale config" classes="z-10">
        <Input
          type="address"
          bind:this={fields.recipient}
          bind:value={recipient}
          validator={addressValidate}
        >
          <span slot="label"> Recipient: </span>
        </Input>

        <Erc20Input
          bind:contract={reserveErc20}
          signer={$signer}
          value={reserve}
          placeholder="Token address"
          bind:this={fields.reserve}
        >
          <span slot="label">Reserve Token Address</span>
        </Erc20Input>

        <span class="z-20 flex w-full flex-col gap-y-3">
          <span>Raise Start/End Time</span>
          <span>
            <Flatpickr
              {options}
              bind:value={startTimestamp}
              bind:formattedValue={startTimestamp}
              name="date"
            /> -
            <Flatpickr
              {options}
              bind:value={endTimestamp}
              bind:formattedValue={endTimestamp}
              name="date"
            />
          </span>
          <span />
        </span>

        <Input
          type="number"
          bind:this={fields.cooldownDuration}
          bind:value={cooldownDuration}
          validator={required}
        >
          <span slot="label"> Cool down duration (in blocks): </span>
        </Input>

        <Input
          type="number"
          bind:this={fields.minimumRaise}
          bind:value={minimumRaise}
          validator={required}
        >
          <span slot="label"> Minimum raise: </span>
        </Input>

        {#if saleType.value == 0}
          <Input
            type="number"
            bind:this={fields.startPrice}
            bind:value={startPrice}
            validator={required}
          >
            <span slot="label"> Price: </span>
          </Input>
        {:else}
          <Input
            type="number"
            bind:this={fields.startPrice}
            bind:value={startPrice}
            validator={required}
          >
            <span slot="label"> Start Price: </span>
          </Input>
        {/if}

        <div id="B" style="display:block" class="w-full">
          <Input
            type="number"
            bind:this={fields.endPrice}
            bind:value={endPrice}
            validator={required}
          >
            <span slot="label"> End Price: </span>
          </Input>
        </div>
      </FormPanel>

      <FormPanel>
        <div>
          <span> Sale End After Hitting Minimum: </span>
          <Switch
            bind:checked={afterMinimumRaiseCheck}
            on:change={() => {
              if (afterMinimumRaiseCheck) {
                canEndCheck = false;
                document.getElementById("exTime").style.display = "none";
              }
            }}
          />
          <br />
          <span class="text-gray-400"
            >Sale can end once the raised amount hits the minimumRaise.</span
          >
        </div>
      </FormPanel>

      <FormPanel>
        <div>
          <span> Sale Extra Time: </span>
          <Switch
            bind:checked={canEndCheck}
            on:change={() => {
              if (canEndCheck) {
                document.getElementById("exTime").style.display = "block";
                afterMinimumRaiseCheck = false;
              } else document.getElementById("exTime").style.display = "none";
            }}
          />
          <br />
          <span class="text-gray-400"
            >Specify extra time for the sale that can continue for, if the
            raised amount reaches a certain amount before the sale's normal end
            time.</span
          >
        </div>
        <div
          id="exTime"
          style="display:none"
          class="flex w-full flex-col gap-y-4"
        >
          <Input
            type="number"
            bind:this={fields.extraTime}
            bind:value={extraTime}
            validator={required}
          >
            <span slot="label"> Extra Time: </span>
            <span slot="description">
              Specify the amount of extra time (in mnutes) you want the raise to
              run if you have raised X amount before end of the raise.</span
            >
          </Input>
          <br />
          <Input
            type="number"
            bind:this={fields.extraTimeAmount}
            bind:value={extraTimeAmount}
            validator={required}
          >
            <span slot="label"> Extra Time trigger amount: </span>
            <span slot="description">
              Specify the amount that needs to be raised before the end of the
              raise for extra time to get activated.</span
            >
          </Input>
          <br /><br />
          <span> Extra Time Discount: </span>
          <Switch
            bind:checked={extraTimeDiscountCheck}
            on:change={() => {
              if (extraTimeDiscountCheck)
                document.getElementById("exDis").style.display = "block";
              else document.getElementById("exDis").style.display = "none";
            }}
          />
          <br />
          <span class="text-gray-400"
            >Discount on price for wallets that have purchased certain amount of
            rTKNs during the raise.</span
          >
          <br />
          <div id="exDis" style="display:none">
            <br />
            <Input
              type="range"
              bind:this={fields.extraTimeDiscount}
              bind:value={extraTimeDiscount}
              validator={required}
              min="0"
              max="99"
            >
              <span slot="label"> Discount: {extraTimeDiscount}%</span>
            </Input>
            <br />
            <Input
              type="number"
              bind:this={fields.extraTimeDiscountThreshold}
              bind:value={extraTimeDiscountThreshold}
              validator={required}
            >
              <span slot="label"> Discount Threshold: </span>
              <span slot="description">
                Amount that each wallet had to be purchased to be eligible for
                the extra time discount.</span
              >
            </Input>
          </div>
        </div>
      </FormPanel>

      <FormPanel>
        <div>
          <span>Tier Discount:</span>
          <Switch
            bind:checked={tierDiscountCheck}
            on:change={() => {
              if (tierDiscountCheck)
                document.getElementById("tierDis").style.display = "block";
              else {
                document.getElementById("tierDis").style.display = "none";
                tierDiscountActCheck = false;
              }
            }}
          />
          <br />
          <span class="text-gray-400"
            >Discount on price for tiered wallets based on the tier they hold.</span
          >
        </div>
        <div id="tierDis" style="display:none" class="w-full">
          <br />
          <Input
            type="address"
            bind:this={fields.tierDiscountAddress}
            bind:value={tierDiscountAddress}
            validator={addressValidate}
            errorMsg={tierDiscountError?.errorMsg}
          >
            <span slot="label">Tier Contract Address: </span>
            <span slot="description">
              The address of the tier contract you want to provide the price
              discounts for.
            </span>
          </Input>
          <br /><br />
          <div class="grid w-full grid-cols-1 items-start">
            <table>
              <tr class="grid w-full grid-cols-2 gap-x-4">
                <td>
                  <span>Tier Discount Perk (percentage)</span><br />
                  <span class="text-gray-400"
                    >Discount on price for holding a certain teir.</span
                  >
                </td>
                <td>
                  <span>Perk Activation Time (Block)</span>
                  <Switch bind:checked={tierDiscountActCheck} />
                  <br />
                  <sapn class="text-gray-400"
                    >Duration of time tier must be held for the perk to
                    activate.</sapn
                  >
                </td>
              </tr><br />
              <tr class="grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier1}
                    bind:value={discountTier1}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 1 Discount: <span style="color:whitesmoke"
                        >{discountTier1}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier1}
                    bind:value={discountActTier1}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 1 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier2}
                    bind:value={discountTier2}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 2 Discount: <span style="color:whitesmoke"
                        >{discountTier2}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier2}
                    bind:value={discountActTier2}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 2 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier3}
                    bind:value={discountTier3}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 3 Discount: <span style="color:whitesmoke"
                        >{discountTier3}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier3}
                    bind:value={discountActTier3}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 3 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier4}
                    bind:value={discountTier4}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 4 Discount: <span style="color:whitesmoke"
                        >{discountTier4}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier4}
                    bind:value={discountActTier4}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 4 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier5}
                    bind:value={discountTier5}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 5 Discount: <span style="color:whitesmoke"
                        >{discountTier5}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier5}
                    bind:value={discountActTier5}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 5 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier6}
                    bind:value={discountTier6}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 6 Discount: <span style="color:whitesmoke"
                        >{discountTier6}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier6}
                    bind:value={discountActTier6}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 6 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier7}
                    bind:value={discountTier7}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 7 Discount: <span style="color:whitesmoke"
                        >{discountTier7}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier7}
                    bind:value={discountActTier7}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 7 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="range"
                    bind:this={fields.discountTier8}
                    bind:value={discountTier8}
                    validator={required}
                    min="0"
                    max="99"
                  >
                    <span slot="description">
                      Tier 8 Discount: <span style="color:whitesmoke"
                        >{discountTier8}%</span
                      ></span
                    >
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.discountActTier8}
                    bind:value={discountActTier8}
                    validator={required}
                    disabled={!tierDiscountActCheck}
                  >
                    <span slot="description"> Tier 8 Duration:</span>
                  </Input>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </FormPanel>

      <FormPanel>
        <div class="grid w-full grid-cols-1 items-start">
          <table class="table-fixed">
            <tr>
              <td>
                Max Cap Per Wallet:
                <Switch bind:checked={maxCapCheck} on:change={MaxCapHandler} />
              </td>
            </tr><span class="text-gray-400"
              >The maximum number of raise tokens purchaseable by each eligible
              address.</span
            >
            <tr>
              <td id="capMax" style="display:none">
                <Input
                  type="number"
                  bind:this={fields.maxWalletCap}
                  bind:value={maxWalletCap}
                  validator={required}
                >
                  <span slot="description" />
                </Input>
              </td>
            </tr>
            <br /><br />
            <tr>
              <td>
                Min Cap Per Wallet:
                <Switch
                  bind:checked={minCapCheck}
                  on:change={() => {
                    if (minCapCheck) {
                      document.getElementById("capMin").style.display = "block";
                    } else
                      document.getElementById("capMin").style.display = "none";
                  }}
                />
              </td>
            </tr>
            <span class="text-gray-400"
              >The minimum number of raise tokens purchaseable by each eligible
              address.</span
            >
            <tr>
              <td id="capMin" style="display:none">
                <Input
                  type="number"
                  bind:this={fields.minWalletCap}
                  bind:value={minWalletCap}
                  validator={required}
                />
              </td>
            </tr>
          </table>
        </div>
      </FormPanel>

      <FormPanel>
        <div>
          <span>Tier Max Cap Per Wallet Multiplier:</span>
          <Switch
            bind:checked={tierCapMulCheck}
            on:change={() => {
              if (tierCapMulCheck) {
                document.getElementById("tierCapMul").style.display = "block";
                maxCapCheck = true;
                MaxCapHandler();
              } else {
                document.getElementById("tierCapMul").style.display = "none";
                tierCapMulActCheck = false;
              }
            }}
          />
          <br />
          <span class="text-gray-400"
            >Multiplier for Max Cap Per Wallet for tiered wallets based on the
            tier they hold.</span
          >
          <br />
          <span class="text-gray-400"
            >*Max Cap Per Wallet must be specified for this tier perk.</span
          >
        </div>
        <div id="tierCapMul" style="display:none" class="w-full">
          <br />
          <Input
            type="address"
            bind:this={fields.tierCapMulAddress}
            bind:value={tierCapMulAddress}
            validator={addressValidate}
            errorMsg={tierCapMulError?.errorMsg}
          >
            <span slot="label">Tier Contract Address: </span>
            <span slot="description">
              The address of the tier contract you want to provide the max
              wallet cap multiplier for.
            </span>
          </Input>
          <br /><br />
          <div class="grid w-full grid-cols-1 items-start">
            <table>
              <tr class="grid w-full grid-cols-2 gap-x-4">
                <td>
                  <span>Tier Cap Multiplier Perk (2 decimals max)</span>
                  <br />
                  <span class="text-gray-400"
                    >Multiplier for max cap per wallet for holding a certain
                    teir.</span
                  >
                </td>
                <td>
                  <span>Perk Activation Period (Block)</span>
                  <Switch bind:checked={tierCapMulActCheck} />
                  <br />
                  <sapn class="text-gray-400"
                    >Duration of time tier must be held for the perk to
                    activate.</sapn
                  >
                </td>
              </tr><br />
              <tr class="grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier1}
                    bind:value={capMulTier1}
                    validator={required}
                  >
                    <span slot="description"> Tier 1 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier1}
                    bind:value={capMulActTier1}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 1 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier2}
                    bind:value={capMulTier2}
                    validator={required}
                  >
                    <span slot="description"> Tier 2 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier2}
                    bind:value={capMulActTier2}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 2 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier3}
                    bind:value={capMulTier3}
                    validator={required}
                  >
                    <span slot="description"> Tier 3 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier3}
                    bind:value={capMulActTier3}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 3 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier4}
                    bind:value={capMulTier4}
                    validator={required}
                  >
                    <span slot="description"> Tier 4 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier4}
                    bind:value={capMulActTier4}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 4 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier5}
                    bind:value={capMulTier5}
                    validator={required}
                  >
                    <span slot="description"> Tier 5 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier5}
                    bind:value={capMulActTier5}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 5 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier6}
                    bind:value={capMulTier6}
                    validator={required}
                  >
                    <span slot="description"> Tier 6 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier6}
                    bind:value={capMulActTier6}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 6 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier7}
                    bind:value={capMulTier7}
                    validator={required}
                  >
                    <span slot="description"> Tier 7 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier7}
                    bind:value={capMulActTier7}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 7 Duration:</span>
                  </Input>
                </td>
              </tr>
              <tr class="m-top grid w-full grid-cols-2 gap-x-4">
                <td>
                  <Input
                    type="number"
                    bind:this={fields.capMulTier8}
                    bind:value={capMulTier8}
                    validator={required}
                  >
                    <span slot="description"> Tier 8 Multiplier:</span>
                  </Input>
                </td>
                <td id="disAct">
                  <Input
                    type="number"
                    bind:this={fields.capMulActTier8}
                    bind:value={capMulActTier8}
                    validator={required}
                    disabled={!tierCapMulActCheck}
                  >
                    <span slot="description"> Tier 8 Duration:</span>
                  </Input>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </FormPanel>

      <FormPanel heading="RedeemableERC20 config">
        <Input
          type="text"
          bind:this={fields.name}
          bind:value={name}
          validator={required}
        >
          <span slot="label"> Name: </span>
        </Input>

        <Input
          type="text"
          bind:this={fields.symbol}
          bind:value={symbol}
          validator={required}
        >
          <span slot="label"> Symbol: </span>
        </Input>

        <Input
          type="number"
          bind:this={fields.initialSupply}
          bind:value={initialSupply}
          validator={required}
        >
          <span slot="label"> Initial supply: </span>
        </Input>

        <Input
          type="address"
          bind:this={fields.distributionEndForwardingAddress}
          bind:value={distributionEndForwardingAddress}
          validator={addressValidate}
        >
          <span slot="label">Forwarding address: </span>
          <span slot="description">
            If set to anything other than the zero address, all unsold rTKN will
            be forwarded to this address at the end of the raise. If the minimum
            raise is 0, this must be set to something other than the zero
            address.
          </span>
        </Input>

        <Input
          type="address"
          bind:this={fields.tier}
          bind:value={tier}
          validator={addressValidate}
          errorMsg={tierError.errorMsg}
        >
          <span slot="label"> Tier: </span>
          <span slot="description">
            The address of a Tier contract to gate with.
          </span>
        </Input>

        <Input
          type="number"
          bind:this={fields.minimumStatus}
          bind:value={minimumStatus}
          validator={required}
        >
          <span slot="label"> Minimum Status: </span>
        </Input>
      </FormPanel>
      <FormPanel>
        {#if !deployPromise}
          <Button
            disabled={tierError?.errorMsg ||
              tierDiscountError?.errorMsg ||
              tierCapMulError?.errorMsg ||
              !startTimestamp ||
              !endTimestamp}
            shrink
            on:click={handleClick}>Deploy Sale</Button
          >
          {#if !tierError?.errorMsg && !tierDiscountError?.errorMsg && !tierCapMulError?.errorMsg && !startTimestamp && !endTimestamp}
            <span class="text-red-400"
              >Please Select Date/Time to Deploy The Sale</span
            >
          {:else if tierError?.errorMsg || tierDiscountError?.errorMsg || tierCapMulError?.errorMsg}
            <span class="text-red-400"
              >Please Fill The Fields With Valid Data To Deploy The Sale</span
            >
          {/if}
        {:else}
          <ContractDeploy {deployPromise} type="Sale" />
        {/if}
      </FormPanel>
    {/if}
  </div>

  <div class="flex w-2/5 flex-col gap-y-4">
    <!-- {#if saleVals && saleType}
      <span class="relative">
        <FormPanel>
          <SaleSmallSimulationChart
            saleType={saleType.value}
            {saleVals}
            {reserveErc20}
          />
        </FormPanel>
      </span>
    {/if} -->
    <!-- {#if FriendlySource && saleType}
      <span class="sticky">
        <FormPanel heading="Human Readable Source">
          <HumanReadable
            signer={$signerAddress}
            contractType="sale"
            {FriendlySource}
          />
        </FormPanel>
      </span>
    {/if} -->
  </div>
</div>

<style>
  :global(.open) {
    --tw-rotate: 0deg !important;
  }

  :global(.flatpickr-input) {
    color: #333;
    width: 48%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
  }
  .m-top {
    margin-top: 15px;
  }

  span.relative {
    margin-top: 52px;
    float: right;
    position: relative;
    /* top: 90px; */
    padding: 5px;
  }

  span.sticky {
    float: right;
    position: sticky;
    top: 90px;
    padding: 5px;
  }
</style>
