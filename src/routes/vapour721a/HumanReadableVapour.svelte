<script lang="ts">
  import { OpMeta, pnp } from "rain-sdk";
  import { Opcode } from "./vapour721a-types";
  import {
    type RainJSVM,
    type StateConfig,
    type StateJSVM,
    HumanFriendlyRead,
  } from "rain-sdk";

  export let vmStateConfig: StateConfig;

  let soulboundScript: StateConfig;
  let saleScript: StateConfig;

  const vapourOpMeta: typeof OpMeta = new Map([
    ...OpMeta,
    [
      47,
      {
        enum: Opcode.IERC721A_TOTAL_SUPPLY,
        name: "IERC721A_TOTAL_SUPPLY",
        pushes: pnp.one,
        pops: pnp.zero,
        jsvmfn: function (
          this: RainJSVM,
          state: StateJSVM,
          operand: number,
          data?: any
        ): void {},
      },
    ],
    [
      48,
      {
        enum: Opcode.IERC721A_TOTAL_MINTED,
        name: "IERC721A_TOTAL_MINTED",
        pushes: pnp.one,
        pops: pnp.zero,
        jsvmfn: function (
          this: RainJSVM,
          state: StateJSVM,
          operand: number,
          data?: any
        ): void {},
      },
    ],
    [
      49,
      {
        enum: Opcode.IERC721A_NUMBER_MINTED,
        name: "IERC721A_NUMBER_MINTED",
        pushes: pnp.one,
        pops: pnp.one,
        jsvmfn: function (
          this: RainJSVM,
          state: StateJSVM,
          operand: number,
          data?: any
        ): void {},
      },
    ],
    [
      50,
      {
        enum: Opcode.IERC721A_NUMBER_BURNED,
        name: "IERC721A_NUMBER_BURNED",
        pushes: pnp.one,
        pops: pnp.one,
        jsvmfn: function (
          this: RainJSVM,
          state: StateJSVM,
          operand: number,
          data?: any
        ): void {},
      },
    ],
  ]);

  HumanFriendlyRead.set(vapourOpMeta);
  $: {
    soulboundScript = {
      constants: vmStateConfig.constants,
      sources: [vmStateConfig.sources[0]],
    };
    saleScript = {
      constants: vmStateConfig.constants,
      sources: [vmStateConfig.sources[1]],
    };
  }
  $: humanFriendlySoulbound = HumanFriendlyRead.get(soulboundScript, {
    pretty: true,
    storageEnums: ["SUPPLY_LIMIT", "AMOUNT_WITHDRAWN", "AMOUNT_PAYABLE"],
    contextEnums: ["ACCOUNT", "BUY_UNITS"],
  });

  $: humanFriendlySale = HumanFriendlyRead.get(saleScript, {
    pretty: true,
    storageEnums: ["SUPPLY_LIMIT", "AMOUNT_WITHDRAWN", "AMOUNT_PAYABLE"],
    contextEnums: ["ACCOUNT", "BUY_UNITS"],
  });
</script>

<div class="flex w-full flex-col gap-y-2 p-4 border-gray-700 rounded-lg border">
  <span class="text-2xl">The Rain script for your NFT collection</span>
  <div class="flex flex-col justify-between">
    <span class="break-words pt-2 pb-2 whitespace-pre text">
      <span class="text-gray-400"
        >Asset's Human Friendly Readable Soulbound Script:</span
      >
      <div class="mt-2">
        {humanFriendlySoulbound}
      </div>
    </span>
  </div>
  <div class="flex flex-col justify-between">
    <span class="break-words pt-2 pb-2 whitespace-pre text">
      <span class="text-gray-400"
        >Asset's Human Friendly Readable Sale Script:</span
      >
      <div>
        {humanFriendlySale}
      </div>
    </span>
  </div>
</div>
