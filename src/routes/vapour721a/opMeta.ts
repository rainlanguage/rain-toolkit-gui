import { OpMeta, pnp } from "rain-sdk";
import { Opcode } from "./vapour721a-types";
import Vapour721AArtifact from "$routes/vapour721a/abi/Vapour721A.json"
import {
    RainJSVM,
    type StateJSVM,
    utils
} from "rain-sdk";
import { ethers } from "ethers";

async function OpIERC721A_TOTAL_SUPPLY(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    if (this.signer !== undefined) {
        const erc721Contract_ = new ethers.Contract(this.self, Vapour721AArtifact.abi, this.signer)
        state.stack.push(await erc721Contract_.totalSupply());
    }
    else throw new Error('Undefined stack variables');
}

async function OpIERC721A_TOTAL_MINTED(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    if (this.signer !== undefined) {
        const erc721Contract_ = new ethers.Contract(this.self, Vapour721AArtifact.abi, this.signer)
        state.stack.push(await erc721Contract_.totalMinted());
    }
    else throw new Error('Undefined stack variables');
}

export async function OpIERC721A_NUMBER_MINTED(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    const item1_ = state.stack.pop();

    if (item1_ && this.signer !== undefined) {
        const account_ = utils.paddedUInt160(item1_);
        const erc721Contract_ = new ethers.Contract(this.self, Vapour721AArtifact.abi, this.signer)
        state.stack.push(await erc721Contract_.numberMinted(account_));

    }
    else throw new Error('Undefined stack variables');
}

export async function OpIERC721A_NUMBER_BURNED(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    const item1_ = state.stack.pop();

    if (item1_ && this.signer !== undefined) {
        const account_ = utils.paddedUInt160(item1_);
        const erc721Contract_ = new ethers.Contract(this.self, Vapour721AArtifact.abi, this.signer)
        state.stack.push(await erc721Contract_.numberBurned(account_));

    }
    else throw new Error('Undefined stack variables');
}

export const vapourOpMeta: typeof OpMeta = new Map([
    ...OpMeta,
    [
        47,
        {
            enum: Opcode.IERC721A_TOTAL_SUPPLY,
            name: "IERC721A_TOTAL_SUPPLY",
            pushes: pnp.one,
            pops: pnp.zero,
            jsvmfn: OpIERC721A_TOTAL_SUPPLY
        },
    ],
    [
        48,
        {
            enum: Opcode.IERC721A_TOTAL_MINTED,
            name: "IERC721A_TOTAL_MINTED",
            pushes: pnp.one,
            pops: pnp.zero,
            jsvmfn: OpIERC721A_TOTAL_MINTED,
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
            ): void { },
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
            ): void { },
        },
    ],
]);
