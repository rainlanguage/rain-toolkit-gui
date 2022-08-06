import type { BigNumber } from "ethers"

export interface Phase {
    start: string,
    end: string,
    pricing: PriceRule,
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

// export interface Holders20 extends Group {
//     contractAddress: string,
//     minBalance: number
// }
