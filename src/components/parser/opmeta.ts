import { AllStandardOps, OpAdd, OpAny, OpBlockNumber, OpCaller, OpDiv, OpEagerIf, OpEqualTo, OpERC1155BalanceOf, OpERC1155BalanceOfBatch, OpERC20BalanceOf, OpERC20SnapshotBalanceOfAt, OpERC20SnapshotTotalSupplyAt, OpERC20TotalSupply, OpERC721BalanceOf, OpERC721OwnerOf, OpEvery, OpExp, OpGreaterThan, OpIsZero, OpITierV2Report, OpITierV2ReportTimesForTier, OpLessThan, OpMax, OpMin, OpMod, OpMul, OpSaturatingAdd, OpSaturatingDiff, OpSaturatingMul, OpSaturatingSub, OpScale18, OpScale18Div, OpScale18Mul, OpScaleBy, OpScaleN, OpSelectLte, OpSub, OpThisAddress, OpTimestamp, OpUpdateTimesForTierRange, pnp, RainJSVM, type IOpMeta, type StateJSVM } from "rain-sdk";

export const OpMeta: Map<number, IOpMeta> = new Map([
    [
        0,
        {
            enum: AllStandardOps.CONSTANT,
            name: 'CONSTANT',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: false,
            jsvmfn: function (
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.constant(operand, data)
            },
            data: { docs: "some docs" }
        }
    ],
    [
        1,
        {
            enum: AllStandardOps.STACK,
            name: 'STACK',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: false,
            jsvmfn: function (
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.stack(operand, data)
            }
        }
    ],
    [
        2,
        {
            enum: AllStandardOps.CONTEXT,
            name: 'CONTEXT',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: false,
            jsvmfn: function (
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.context(operand, data)
            }
        }
    ],
    [
        3,
        {
            enum: AllStandardOps.STORAGE,
            name: 'STORAGE',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: false,
            jsvmfn: async function (
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): Promise<void> {
                await this.storage(operand, data)
            }
        }
    ],
    [
        4,
        {
            enum: AllStandardOps.ZIPMAP,
            name: 'ZIPMAP',
            description: '',
            pushes: pnp.zpush,
            pops: pnp.derived,
            isZeroOperand: false,
            jsvmfn: async function (
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): Promise<void> {
                await this.zipmap(operand, data)
            }
        }
    ],
    [
        5,
        {
            enum: AllStandardOps.DEBUG,
            name: 'DEBUG',
            description: '',
            pushes: pnp.zero,
            pops: pnp.zero,
            isZeroOperand: false,
            jsvmfn: function (
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.debug(operand, data)
            }
        }
    ],
    [
        6,
        {
            enum: AllStandardOps.IERC20_BALANCE_OF,
            name: 'IERC20_BALANCE_OF',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: false,
            jsvmfn: OpERC20BalanceOf
        }
    ],
    [
        7,
        {
            enum: AllStandardOps.IERC20_TOTAL_SUPPLY,
            name: 'IERC20_TOTAL_SUPPLY',
            description: '',
            pushes: pnp.one,
            pops: pnp.one,
            isZeroOperand: false,
            jsvmfn: OpERC20TotalSupply
        }
    ],
    [
        8,
        {
            enum: AllStandardOps.IERC20_SNAPSHOT_BALANCE_OF_AT,
            name: 'IERC20_SNAPSHOT_BALANCE_OF_AT',
            description: '',
            pushes: pnp.one,
            pops: pnp.three,
            isZeroOperand: false,
            jsvmfn: OpERC20SnapshotBalanceOfAt
        }
    ],
    [
        9,
        {
            enum: AllStandardOps.IERC20_SNAPSHOT_TOTAL_SUPPLY_AT,
            name: 'IERC20_SNAPSHOT_TOTAL_SUPPLY_AT',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: false,
            jsvmfn: OpERC20SnapshotTotalSupplyAt
        }
    ],
    [
        10,
        {
            enum: AllStandardOps.IERC721_BALANCE_OF,
            name: 'IERC721_BALANCE_OF',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: false,
            jsvmfn: OpERC721BalanceOf
        }
    ],
    [
        11,
        {
            enum: AllStandardOps.IERC721_OWNER_OF,
            name: 'IERC721_OWNER_OF',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: false,
            jsvmfn: OpERC721OwnerOf
        }
    ],
    [
        12,
        {
            enum: AllStandardOps.IERC1155_BALANCE_OF,
            name: 'IERC1155_BALANCE_OF',
            description: '',
            pushes: pnp.one,
            pops: pnp.three,
            isZeroOperand: false,
            jsvmfn: OpERC1155BalanceOf
        }
    ],
    [
        13,
        {
            enum: AllStandardOps.IERC1155_BALANCE_OF_BATCH,
            name: 'IERC1155_BALANCE_OF_BATCH',
            description: '',
            pushes: pnp.oprnd,
            pops: pnp.derived,
            isZeroOperand: false,
            jsvmfn: OpERC1155BalanceOfBatch
        }
    ],
    [
        14,
        {
            enum: AllStandardOps.BLOCK_NUMBER,
            name: 'BLOCK_NUMBER',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: true,
            jsvmfn: OpBlockNumber,
            aliases: ['CURRENT_BLOCK']
        }
    ],
    [
        15,
        {
            enum: AllStandardOps.SENDER,
            name: 'SENDER',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: true,
            jsvmfn: OpCaller,
            aliases: ['MSG_SENDER']
        }
    ],
    [
        16,
        {
            enum: AllStandardOps.THIS_ADDRESS,
            name: 'THIS_ADDRESS',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: true,
            jsvmfn: OpThisAddress,
            aliases: ['THIS_ADDRESS']
        }
    ],
    [
        17,
        {
            enum: AllStandardOps.BLOCK_TIMESTAMP,
            name: 'BLOCK_TIMESTAMP',
            description: '',
            pushes: pnp.one,
            pops: pnp.zero,
            isZeroOperand: true,
            jsvmfn: OpTimestamp,
            aliases: ['CURRENT_TIMESTAMP']
        }
    ],
    [
        18,
        {
            enum: AllStandardOps.SCALE18,
            name: 'SCALE18',
            description: '',
            pushes: pnp.one,
            pops: pnp.one,
            isZeroOperand: false,
            jsvmfn: OpScale18
        }
    ],
    [
        19,
        {
            enum: AllStandardOps.SCALE18_DIV,
            name: 'SCALE18_DIV',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: false,
            jsvmfn: OpScale18Div
        }
    ],
    [
        20,
        {
            enum: AllStandardOps.SCALE18_MUL,
            name: 'SCALE18_MUL',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: false,
            jsvmfn: OpScale18Mul
        }
    ],
    [
        21,
        {
            enum: AllStandardOps.SCALE_BY,
            name: 'SCALE_BY',
            description: '',
            pushes: pnp.one,
            pops: pnp.one,
            isZeroOperand: false,
            jsvmfn: OpScaleBy
        }
    ],
    [
        22,
        {
            enum: AllStandardOps.SCALEN,
            name: 'SCALEN',
            description: '',
            pushes: pnp.one,
            pops: pnp.one,
            isZeroOperand: false,
            jsvmfn: OpScaleN
        }
    ],
    [
        23,
        {
            enum: AllStandardOps.ANY,
            name: 'ANY',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpAny
        }
    ],
    [
        24,
        {
            enum: AllStandardOps.EAGER_IF,
            name: 'EAGER_IF',
            description: '',
            pushes: pnp.one,
            pops: pnp.three,
            isZeroOperand: true,
            jsvmfn: OpEagerIf
        }
    ],
    [
        25,
        {
            enum: AllStandardOps.EQUAL_TO,
            name: 'EQUAL_TO',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: true,
            jsvmfn: OpEqualTo
        }
    ],
    [
        26,
        {
            enum: AllStandardOps.EVERY,
            name: 'EVERY',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpEvery
        }
    ],
    [
        27,
        {
            enum: AllStandardOps.GREATER_THAN,
            name: 'GREATER_THAN',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: true,
            jsvmfn: OpGreaterThan
        }
    ],
    [
        28,
        {
            enum: AllStandardOps.ISZERO,
            name: 'ISZERO',
            description: '',
            pushes: pnp.one,
            pops: pnp.one,
            isZeroOperand: true,
            jsvmfn: OpIsZero
        }
    ],
    [
        29,
        {
            enum: AllStandardOps.LESS_THAN,
            name: 'LESS_THAN',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: true,
            jsvmfn: OpLessThan
        }
    ],
    [
        30,
        {
            enum: AllStandardOps.SATURATING_ADD,
            name: 'SATURATING_ADD',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpSaturatingAdd
        }
    ],
    [
        31,
        {
            enum: AllStandardOps.SATURATING_MUL,
            name: 'SATURATING_MUL',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpSaturatingMul
        }
    ],
    [
        32,
        {
            enum: AllStandardOps.SATURATING_SUB,
            name: 'SATURATING_SUB',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpSaturatingSub
        }
    ],
    [
        33,
        {
            enum: AllStandardOps.ADD,
            name: 'ADD',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpAdd
        }
    ],
    [
        34,
        {
            enum: AllStandardOps.DIV,
            name: 'DIV',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpDiv
        }
    ],
    [
        35,
        {
            enum: AllStandardOps.EXP,
            name: 'EXP',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpExp
        }
    ],
    [
        36,
        {
            enum: AllStandardOps.MAX,
            name: 'MAX',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpMax
        }
    ],
    [
        37,
        {
            enum: AllStandardOps.MIN,
            name: 'MIN',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpMin
        }
    ],
    [
        38,
        {
            enum: AllStandardOps.MOD,
            name: 'MOD',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpMod
        }
    ],
    [
        39,
        {
            enum: AllStandardOps.MUL,
            name: 'MUL',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpMul
        }
    ],
    [
        40,
        {
            enum: AllStandardOps.SUB,
            name: 'SUB',
            description: '',
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpSub
        }
    ],
    [
        41,
        {
            enum: AllStandardOps.ITIERV2_REPORT,
            name: 'ITIERV2_REPORT',
            description: '',
            pushes: pnp.one,
            pops: pnp.derived,
            isZeroOperand: false,
            jsvmfn: OpITierV2Report
        }
    ],
    [
        42,
        {
            enum: AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER,
            name: 'ITIERV2_REPORT_TIME_FOR_TIER',
            description: '',
            pushes: pnp.one,
            pops: pnp.derived,
            isZeroOperand: false,
            jsvmfn: OpITierV2ReportTimesForTier
        }
    ],
    [
        43,
        {
            enum: AllStandardOps.SATURATING_DIFF,
            name: 'SATURATING_DIFF',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: true,
            jsvmfn: OpSaturatingDiff
        }
    ],
    [
        44,
        {
            enum: AllStandardOps.SELECT_LTE,
            name: 'SELECT_LTE',
            description: '',
            pushes: pnp.one,
            pops: pnp.derived,
            isZeroOperand: false,
            jsvmfn: OpSelectLte
        }
    ],
    [
        45,
        {
            enum: AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE,
            name: 'UPDATE_TIMES_FOR_TIER_RANGE',
            description: '',
            pushes: pnp.one,
            pops: pnp.two,
            isZeroOperand: false,
            jsvmfn: OpUpdateTimesForTierRange
        }
    ]
]);