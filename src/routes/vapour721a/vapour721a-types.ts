import type { BigNumber, BigNumberish, BytesLike, Contract } from "ethers"
import { AllStandardOps } from "rain-sdk"

// UI stuff
export enum CreateSteps {
    Configure,
    Confirm,
    Complete
}

// Config
export interface Vapour721AConfig {
    name: string,
    symbol: string,
    description: string,
    imageFile: File,
    maxSupply: number,
    currency: string,
    royalty: number,
    recipient: string,
    owner: string,
    admin: string,
    useNativeToken: boolean,
    currencyContract: Contract,
    phases: Phase[],
    soulbound: boolean,
    erc20info: {
        ready: boolean,
        name: string,
        symbol: string,
        decimals: BigNumber,
        balance: BigNumber,
    }
}

export interface Phase {
    start: string,
    pricing: PriceRule,
    walletCap: number,
    allowedGroups?: Group[]
}

// Pricing rules
export enum PricingRules {
    FixedPrice,
    StartEndPrice,
    LinearIncrease
}

export type PriceRule = FixedPrice | StartEndPrice | LinearIncrease

export interface FixedPrice {
    type: PricingRules.FixedPrice
    startPrice: number
}

export interface StartEndPrice {
    type: PricingRules.StartEndPrice
    startPrice: number,
    endPrice: number
}
export interface LinearIncrease {
    type: PricingRules.LinearIncrease
    startPrice: number,
    increase: number,
    period: number
}

export const pricingOptions = [
    { value: PricingRules.FixedPrice, label: "Fixed Price" },
    { value: PricingRules.StartEndPrice, label: "Start/End Price" },
    { value: PricingRules.LinearIncrease, label: "Increasing Price" },
];

// Access groups
export enum AllowedGroup {
    Allowlisters,
    NFTHolders,
    SBTHolders
}

export type Group = NFTHolders | SBTHolders | AllowListers

export interface NFTHolders {
    type: AllowedGroup.NFTHolders
    contractAddress: string,
    minBalance: number
}

export interface SBTHolders {
    type: AllowedGroup.SBTHolders
    contractAddress: string,
    minBalance: number
}

export interface AllowListers {
    type: AllowedGroup.Allowlisters
    contractAddress: string,
}

export const groupOptions = [
    { value: AllowedGroup.Allowlisters, label: "Allow list" },
    { value: AllowedGroup.NFTHolders, label: "NFT Holders" },
    { value: AllowedGroup.SBTHolders, label: "SBT Holders" },
];

// For the contract

export type StateConfigStruct = {
    sources: BytesLike[];
    constants: BigNumberish[];
};

export type InitializeConfigStruct = {
    name: string;
    symbol: string;
    baseURI: string;
    supplyLimit: BigNumberish;
    recipient: string;
    owner: string;
    admin: string;
    royaltyBPS: BigNumberish;
    currency: string;
    vmStateConfig: StateConfigStruct;
};

// Opcode stuff

enum LocalOpcodes {
    IERC721A_TOTAL_SUPPLY = AllStandardOps.length,
    IERC721A_TOTAL_MINTED = AllStandardOps.length + 1,
    IERC721A_NUMBER_MINTED = AllStandardOps.length + 2,
    IERC721A_NUMBER_BURNED = AllStandardOps.length + 3,
}

export const Opcode = {
    ...AllStandardOps,
    ...LocalOpcodes,
};

export enum StorageOpcodes {
    SUPPLY_LIMIT,
    AMOUNT_WITHDRAWN,
    AMOUNT_PAYABLE,
}