import { AllowedGroup, Opcode, PricingRules, type Group, type Phase, type PriceRule, type Vapour721AConfig } from "$routes/vapour721a/vapour721a-types";
import { ethers, type BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { RuleBuilder, VM, type Condition, type ConditionGroup, type Price, type Quantity, type Rule, type StateConfig } from "rain-sdk";
import { concat, op } from "rain-sdk/dist/utils";

export const arrayAdd = (array: any[], add: any) => {
    return array = [
        ...array,
        add
    ];
};

export const arrayRemove = (array: any[], i: number) => {
    return array = [
        ...array.slice(0, i),
        ...array.slice(i + 1),
    ];
};

export const initVapourPhase = (): Phase => {
    return {
        start: null,
        pricing: {
            type: PricingRules.FixedPrice as PricingRules.FixedPrice,
            startPrice: null,
        },
        allowedGroups: [],
        walletCap: null
    }
}

export const initVapourConfig = (signerAddress): Vapour721AConfig => {
    return {
        name: null,
        symbol: null,
        description: null,
        imageFile: null,
        maxSupply: null,
        currency: null,
        royalty: null,
        recipient: signerAddress,
        owner: signerAddress,
        admin: signerAddress,
        useNativeToken: false,
        currencyContract: null,
        phases: [initVapourPhase()],
        soulbound: false,
        erc20info: {
            ready: false,
            name: null,
            symbol: null,
            decimals: null,
            balance: null,
        }
    }
}

type Context = {
    currencyInfo?: {
        ready: boolean,
        name: string,
        symbol: string,
        decimals: BigNumber,
        balance: BigNumber,
    },
    phases?: Phase[],
    phase?: Phase,
    phaseIndex?: number
}

const generateGroupCondition = (group: Group, context: Context): Condition => {
    if (group.type == AllowedGroup.Allowlisters) {
        return {
            struct: {
                subject: 'has-any-tier',
                args: {
                    tierAddress: group.contractAddress
                }
            },
            operator: 'true'
        }
    }
    else if (group.type == AllowedGroup.NFTHolders || group.type == AllowedGroup.SBTHolders) {
        return {
            struct: {
                subject: 'user-erc721-balance',
                args: {
                    tokenAddress: group.contractAddress
                }
            },
            struct2: {
                subject: 'constant',
                args: {
                    value: ethers.BigNumber.from(group.minBalance)
                }
            },
            operator: "gte"
        }
    }
}

const generatePrice = (priceRule: PriceRule, context: Context): Price => {
    if (priceRule.type == PricingRules.FixedPrice) {
        return {
            struct: {
                subject: 'constant',
                args: {
                    value: parseUnits(priceRule.startPrice.toString(), context.currencyInfo.decimals)
                }
            }
        }
    } else if
        (priceRule.type == PricingRules.StartEndPrice) {
        if (context.phaseIndex == context.phases.length - 1) {
            throw "Can't use startPrice > endPrice rule if it's the last phase."
        }
        const startTimestamp = new Date(context.phase.start).getTime() / 1000
        const endTimestamp = new Date(context.phases[context.phaseIndex + 1].start)
        return {
            struct: {
                subject: "increasing-by-time",
                args: {
                    startValue: parseUnits(priceRule.startPrice.toString(), context.currencyInfo.decimals),
                    endValue: parseUnits(priceRule.endPrice.toString(), context.currencyInfo.decimals),
                    startTimestamp,
                    endTimestamp
                }
            }
        } as unknown as Price
    }
}

const maxCapForWallet = (cap: BigNumber): StateConfig => {
    return {
        sources: [
            concat([
                op(Opcode.CONSTANT, 0), // cap
                op(Opcode.CONTEXT, 0), // address of minter
                op(Opcode.IERC721A_NUMBER_MINTED), // number they've minted
                op(Opcode.SATURATING_SUB, 2) // (the cap) - (what they've minted so far)
            ])
        ],
        constants: [cap]
    }
}

export const prepare = (config: Vapour721AConfig) => {
    const context: Context = { currencyInfo: config.erc20info }
    const rules: Rule = config.phases.map((phase, index, phases) => {
        const conditions: Condition[] = phase.allowedGroups.map((group) => {
            return generateGroupCondition(group, context)
        })
        const conditionGroup: ConditionGroup = { conditions, operator: 'and' }
        const quantity: Quantity = { struct: maxCapForWallet(ethers.BigNumber.from(phase.walletCap)) }
        // const price: 
    })

    // RuleBuilder.singleBuild()
}