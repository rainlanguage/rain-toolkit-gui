import { formatAddress } from "$src/utils";
import { ethers, Signer } from "ethers";
import { ERC721, type Condition, type StateConfig, type Struct } from "rain-sdk";

export const naturalLanguageCondition = async (condition: Condition, signer: Signer): Promise<string[]> => {
    const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' })
    let struct: Struct, struct2: Struct
    if (condition === 'always' || condition === 'never') {
        return ['']
    }
    else if ('constants' && 'sources' in condition) {
        return [''];
    }
    else if ('struct' in condition) {
        struct = condition.struct

        if ('subject' in condition.struct) {

            // aliasing the structs
            const struct = condition?.struct

            if (struct.subject == "before-time") {
                const date = new Date(struct.args.timestamp * 1000)
                return [`the time is before ${dateFormat.format(date)}`]

            } else if (struct.subject == "after-time") {
                const date = new Date(struct.args.timestamp * 1000)
                return [`the time is after ${dateFormat.format(date)}`]

            } else if (struct.subject == "between-times") {
                const start = new Date(struct.args.startTimestamp * 1000)
                const end = new Date(struct.args.endTimestamp * 1000)
                return [`the time is between ${dateFormat.format(start)} and ${dateFormat.format(end)}`]

            } else if (struct.subject == "before-block") {

            } else if (struct.subject == "after-block") {

            } else if (struct.subject == "between-blocks") {

            } else if (struct.subject == "has-min-tier") {

            } else if (struct.subject == "has-any-tier") {
                return [`you have any tier in Tier contract ${formatAddress(struct.args.tierAddress)}`]
            } else if (struct.subject == "user-erc20-balance") {

            } else if (struct.subject == "erc20-total-supply") {

            } else if (struct.subject == "user-erc721-balance") {
                if ('struct2' in condition && 'subject' in condition.struct2 && condition.struct2.subject == 'constant') {
                    const struct2 = condition.struct2
                    return [`you hold at least ${ethers.BigNumber.from(struct2.args.value)} ${await (new ERC721(struct.args.tokenAddress, signer)).name()} NFT `]
                }
            } else if (struct.subject == "erc721-owner") {

            } else if (struct.subject == "user-erc1155-balance") {

            } else if (struct.subject == "user-erc20-snapshot-balance") {

            } else if (struct.subject == "erc20-snapshot-total-supply") {

            } else if (struct.subject == "constant") {

            }
        }
    }
}