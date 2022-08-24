import { contractInfo } from "./mint";
import IPFSGatewayTools from "@pinata/ipfs-gateway-tools/dist/browser";
import { toast } from "@zerodevx/svelte-toast";
import { derived, type Readable } from "svelte/store";
import { contracts } from "svelte-ethers-store";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

const ipfs_gateway = import.meta.env.VITE_IPFS_GATEWAY;

export const nextTokenMetadata: Readable<any> = derived(contractInfo, ($contractInfo, set) => {
    if ($contractInfo?.noOfNfts !== undefined) {
        const noOfNfts = $contractInfo?.noOfNfts % 9;
        const convertedGatewayUrl = new IPFSGatewayTools().convertToDesiredGateway(
            `${$contractInfo.baseURI}/${noOfNfts + 1}.json`,
            ipfs_gateway
        );
        try {
            (async () => {
                const metadata = await (await fetch(convertedGatewayUrl)).json();
                const imgURL = new URL(metadata.image);
                if (imgURL.protocol == "ipfs:") {
                    metadata.image = new IPFSGatewayTools().convertToDesiredGateway(
                        metadata.image,
                        ipfs_gateway
                    )
                }
                const img = new Image();
                img.src = metadata.image;
                img.onload = () => {
                    set(metadata);
                };
            })()
        } catch {
            toast.push('<span style="color:red">Something went wrong</span>');
            throw Error();
        }
    }
}, null)

export const singleQuote = derived([contracts, contractInfo], ([$contracts, $contractInfo], set) => {
    if ($contracts.nftContract && $contractInfo) {
        const quote = $contracts.nftContract.calculateBuy("0xf6CF014a3e92f214a3332F0d379aD32bf0Fae929", ethers.BigNumber.from(1)).then(res => {
            set(formatUnits(res.price_, $contractInfo.currency.decimals))
        })
    }
}, null)
