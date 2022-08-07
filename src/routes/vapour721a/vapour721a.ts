import { AllowedGroup, Opcode, PricingRules, type ERC20Info, type Group, type InitializeConfigStruct, type Phase, type PriceRule, type Vapour721AConfig } from "$routes/vapour721a/vapour721a-types";
import { op } from "$src/utils";
import { ethers, type BigNumber } from "ethers";
import { concat, parseUnits } from "ethers/lib/utils";
import { RuleBuilder, VM, type Condition, type ConditionGroup, type Currency, type Price, type Quantity, type Rule, type StateConfig } from "rain-sdk";

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
        name: "josh",
        symbol: "test",
        description: "a description",
        imageFile: null,
        maxSupply: 20,
        currency: "0x25a4Dd4cd97ED462EB5228de47822e636ec3E31A",
        royalty: 20,
        recipient: signerAddress,
        owner: signerAddress,
        admin: signerAddress,
        useNativeToken: false,
        currencyContract: null,
        phases: [
            {
                "start": "2022-08-07T21:36",
                "pricing": {
                    "type": 0,
                    "startPrice": 0
                },
                "allowedGroups": [
                    {
                        "type": 0,
                        "contractAddress": "0x43F76B029c9BD72A37367DA5c0323f078A86f0b2"
                    }
                ],
                "walletCap": 5
            },
            {
                "start": "2022-08-09T20:36",
                "pricing": {
                    "type": 0,
                    "startPrice": 10
                },
                "allowedGroups": [],
                "walletCap": 20
            }
        ],
        soulbound: true,
        erc20info: {
            ready: false,
            name: null,
            symbol: null,
            decimals: null,
            balance: null,
        },
        mediaUploadResp: null,
        baseURI: null
    }
    // return {
    //     name: null,
    //     symbol: null,
    //     description: null,
    //     imageFile: null,
    //     maxSupply: null,
    //     currency: null,
    //     royalty: null,
    //     recipient: signerAddress,
    //     owner: signerAddress,
    //     admin: signerAddress,
    //     useNativeToken: false,
    //     currencyContract: null,
    //     phases: [initVapourPhase()],
    //     soulbound: false,
    //     erc20info: {
    //         ready: false,
    //         name: null,
    //         symbol: null,
    //         decimals: null,
    //         balance: null,
    //     },
    //     mediaUploadResp: null,
    //     baseURI: null
    // }
}


const generateGroupCondition = (group: Group): Condition => {
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

const generateTimeCondition = (phase: Phase, context: { phases: Phase[], phaseIndex: number }): Condition => {
    // generate the start times for each phase
    const startTimes: number[] = context.phases.map(phase => new Date(phase.start).getTime() / 1000)
    console.log(context.phaseIndex, context.phases.length)
    if (phase.start == "now" && context.phases.length == 1) {
        return null
    }
    else if (phase.start == "now") {
        return {
            struct: {
                subject: "before-time",
                args: {
                    timestamp: new Date(context.phases[context.phaseIndex + 1].start).getTime() / 1000
                },
            },
            operator: "true"
        }
    }
    else if (context.phaseIndex == context.phases.length - 1) {
        console.log('should be after time')
        return {
            struct: {
                subject: "after-time",
                args: {
                    timestamp: new Date(phase.start).getTime() / 1000
                }
            },
            operator: "true"
        }
    }
    else {
        return {
            struct: {
                subject: "between-times",
                args: {
                    startTimestamp: new Date(phase.start).getTime() / 1000,
                    endTimestamp: new Date(context.phases[context.phaseIndex + 1].start).getTime() / 1000
                }
            },
            operator: "true"
        }
    }
}

const generatePrice = (
    priceRule: PriceRule,
    context: {
        phase: Phase,
        phases: Phase[],
        phaseIndex: number,
        currencyInfo: ERC20Info
    }): Price => {
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
        const endTimestamp = new Date(context.phases[context.phaseIndex + 1].start).getTime() / 1000
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
        } as Price
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

const alwaysFalse = (): StateConfig => {
    return {
        sources: [
            concat([
                op(Opcode.CONSTANT, 0)
            ]),
        ],
        constants: [0]
    }
}

const alwaysTrue = (): StateConfig => {
    return {
        sources: [
            concat([
                op(Opcode.CONSTANT, 0)
            ]),
        ],
        constants: [1]
    }
}

const prepareBuyConfig = (config: Vapour721AConfig): StateConfig => {
    const rules: Rule[] = config.phases.map((phase, phaseIndex, phases) => {
        // generate all the conditions for allowed groups
        const groupConditions: Condition[] = phase.allowedGroups.map((group) => {
            return generateGroupCondition(group)
        })
        const groupConditionsGroup: ConditionGroup =
            groupConditions.length > 1 ? { conditions: groupConditions, operator: 'and' }
                : { conditions: groupConditions, operator: 'true' }

        // generate the condition for the time
        const timeCondition: Condition = generateTimeCondition(phase, { phases, phaseIndex })
        console.log(timeCondition)
        // combine them, or if we got back null for time condition just use the group conditions
        const conditions: ConditionGroup =
            !timeCondition ? groupConditionsGroup
                : !groupConditions.length ? { conditions: [timeCondition], operator: "true" }
                    : { conditions: [groupConditionsGroup, timeCondition], operator: "and" }

        // quantity and price
        const quantity: Quantity = { struct: maxCapForWallet(ethers.BigNumber.from(phase.walletCap)) }
        const price: Price = generatePrice(phase.pricing, { phase, phases, phaseIndex, currencyInfo: config.erc20info })

        return {
            priceConditions: conditions,
            quantityConditions: conditions,
            quantity,
            price
        }
    })
    const currency: Currency = {
        rules,
        default: {
            quantity: { struct: alwaysFalse() },
            price: { struct: alwaysFalse() }
        },
        pick: {
            quantities: "max",
            prices: "min"
        }
    }
    console.log(JSON.stringify(currency, null, 2))
    return RuleBuilder.singleBuild(currency)
}

const prepareSoulConfig = (config: Vapour721AConfig): StateConfig => {
    return config.soulbound
        ? alwaysFalse()
        : alwaysTrue()
}

export const prepare = (config: Vapour721AConfig): InitializeConfigStruct => {
    const buyConfig: StateConfig = prepareBuyConfig(config)
    const soulConfig: StateConfig = prepareSoulConfig(config)
    const vmStateConfig = VM.combiner(soulConfig, buyConfig, { numberOfSources: 0 })
    const royaltyBPS = (config.royalty / 100) * 10000;

    return {
        name: config.name,
        symbol: config.symbol,
        baseURI: config.baseURI,
        supplyLimit: config.maxSupply,
        recipient: config.recipient,
        owner: config.owner,
        admin: config.admin,
        royaltyBPS,
        currency: config.currency,
        vmStateConfig
    }
}