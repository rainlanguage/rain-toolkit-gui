import { AllowedGroup, Opcode, PricingRules, type ERC20Info, type Group, type InitializeConfigStruct, type Phase, type PriceRule, type Vapour721AConfig } from "$routes/vapour721a/vapour721a-types";
import { op } from "$src/utils";
import { ethers, type BigNumber } from "ethers";
import { concat, hexlify, parseUnits } from "ethers/lib/utils";
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
                "start": "now",
                "pricing": {
                    "type": 0,
                    "startPrice": 1
                },
                "allowedGroups": [
                    {
                        "type": 0,
                        "contractAddress": "0x08E46BB0510180bB5e763E73bF3Ae5d49004D6D5"
                    }
                ],
                "walletCap": 5
            },
            {
                "start": "2022-08-07T23:38",
                "pricing": {
                    "type": 0,
                    "startPrice": 10
                },
                "allowedGroups": [
                    {
                        "type": 1,
                        "contractAddress": "0x8d88dfb98ba02a6a15784966ed9e6ffa734ad4a6",
                        "minBalance": 1
                    }
                ],
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
        },
        mediaUploadResp: null,
        baseURI: null
    }
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
        constants: [ethers.constants.MaxUint256]
    }
}

const prepareBuyConfig = (config: Vapour721AConfig): [StateConfig, Currency] => {
    const rules: Rule[] = config.phases.map((phase, phaseIndex, phases) => {
        // generate all the conditions for allowed groups
        const groupConditions: Condition[] = phase.allowedGroups.map((group) => {
            return generateGroupCondition(group)
        })
        const groupConditionsGroup: ConditionGroup = { conditions: groupConditions, operator: 'and' }

        // generate the condition for the time
        const timeCondition: Condition = generateTimeCondition(phase, { phases, phaseIndex })

        // combine them, or if we got back null for time condition just use the group conditions
        let conditions: ConditionGroup
        if (!timeCondition && !groupConditions.length) {
            conditions = { conditions: [{ struct: alwaysTrue(), operator: "true" }], operator: "true" }
        }
        else if (!timeCondition && groupConditions.length == 1) {
            conditions = { conditions: groupConditions, operator: "true" }
        } else if (!timeCondition && groupConditions.length > 1) {
            conditions = { conditions: groupConditions, operator: "and" }
        } else if (timeCondition && !groupConditions.length) {
            conditions = { conditions: [timeCondition], operator: "true" }
        } else if (timeCondition && groupConditions.length == 1) {
            conditions = { conditions: [...groupConditions, timeCondition], operator: "and" }
        } else if (timeCondition && groupConditions.length > 1) {
            conditions = { conditions: [groupConditionsGroup, timeCondition], operator: "and" }
        }

        // quantity and price
        const quantity: Quantity = { struct: maxCapForWallet(ethers.BigNumber.from(phase.walletCap || ethers.constants.MaxUint256)) }
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
            price: { struct: alwaysTrue() }
        },
        pick: {
            quantities: "max",
            prices: "min"
        }
    }
    // console.log(JSON.stringify(currency, null, 2))
    return [new RuleBuilder([currency]), currency]
}

const prepareSoulConfig = (config: Vapour721AConfig): StateConfig => {
    return config.soulbound
        ? alwaysFalse()
        : alwaysTrue()
}

export const prepare = (config: Vapour721AConfig): [InitializeConfigStruct, Currency] => {
    const [buyConfig, rules]: [StateConfig, Currency] = prepareBuyConfig(config)
    const soulConfig: StateConfig = prepareSoulConfig(config)
    const vmStateConfig = VM.combiner(soulConfig, buyConfig, { numberOfSources: 0 })
    const royaltyBPS = (config.royalty / 100) * 10000;
    const currency = config.useNativeToken ? ethers.constants.AddressZero : config.currency

    return [{
        name: config.name,
        symbol: config.symbol,
        baseURI: config.baseURI,
        supplyLimit: config.maxSupply,
        recipient: config.recipient,
        owner: config.owner,
        admin: config.admin,
        royaltyBPS,
        currency: currency,
        vmStateConfig
    }, rules]
}

export const getNumberOfRules = (config: Vapour721AConfig): number => {
    const rules: Rule[] = config.phases.map((phase, phaseIndex, phases) => {
        // generate all the conditions for allowed groups
        const groupConditions: Condition[] = phase.allowedGroups.map((group) => {
            return generateGroupCondition(group)
        })
        const groupConditionsGroup: ConditionGroup = { conditions: groupConditions, operator: 'and' }

        // generate the condition for the time
        const timeCondition: Condition = generateTimeCondition(phase, { phases, phaseIndex })

        // combine them, or if we got back null for time condition just use the group conditions
        let conditions: ConditionGroup
        if (!timeCondition && !groupConditions.length) {
            conditions = { conditions: [{ struct: alwaysTrue(), operator: "true" }], operator: "true" }
        }
        else if (!timeCondition && groupConditions.length == 1) {
            conditions = { conditions: groupConditions, operator: "true" }
        } else if (!timeCondition && groupConditions.length > 1) {
            conditions = { conditions: groupConditions, operator: "and" }
        } else if (timeCondition && !groupConditions.length) {
            conditions = { conditions: [timeCondition], operator: "true" }
        } else if (timeCondition && groupConditions.length == 1) {
            conditions = { conditions: [...groupConditions, timeCondition], operator: "and" }
        } else if (timeCondition && groupConditions.length > 1) {
            conditions = { conditions: [groupConditionsGroup, timeCondition], operator: "and" }
        }

        // quantity and price
        const quantity: Quantity = { struct: maxCapForWallet(ethers.BigNumber.from(phase.walletCap || ethers.constants.MaxUint256)) }
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
            price: { struct: alwaysTrue() }
        },
        pick: {
            quantities: "max",
            prices: "min"
        }
    }

    return currency.rules.length
}

export const hexlifySources = (currency: Currency): Currency => {
    const traverse = (data: any) => {
        Object.entries(data).forEach(([key, value]: [any, any]) => {
            if (value?.sources) {
                data[key].sources.forEach((source, i) => {
                    data[key].sources[i] = hexlify(data[key].sources[i])
                })
            }
            else if (typeof value === "object") {
                traverse(value)
            }
        })
        return data
    }
    return traverse(currency)
}