import { BigNumber, ethers, type BigNumberish } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { connected, contracts, defaultEvmStores, signer, signerAddress } from "svelte-ethers-store";
import { derived, writable, type Readable } from "svelte/store";
import { toast } from "@zerodevx/svelte-toast";
import { createClient, gql } from "@urql/svelte";
import Vapour721AArtifact from "../abi/Vapour721A.json";
import { ERC20 } from "rain-sdk";

export const client = createClient({
    url: "https://api.thegraph.com/subgraphs/name/vishalkale151071/rain-protocol"
    // url: AddressBook.getSubgraphEndpoint(Number($selectedNetwork.config.chainId))
})

export type MintQuote = {
    maxUnits?;
    price?;
    totalPrice?;
    totalPriceFormatted?;
    finalUnits?: BigNumber;
    signerReserveBalance?;
    signerReserveBalanceFormatted?;
    targetUnits?;
    calculating;
};

const query = gql(`
query ($contractAddress: Bytes!) {
    vapour721A(id: $contractAddress) {
      id
      deployer
      deployTimestamp
      deployBlockNumber
      name
      symbol
      royaltyBPS
      supplyLimit
      baseURI
      owner
      recipient
      amountPayable
      amountWithdrawn
      withdrawals {
        withdrawer
        amount
        timeStamp
      }
      vmStateConfig {
        sources
        constants
      }
      mintTransactions {
        id
        hash
        receiver
        units
        cost
        mintTimestamp
        mintBlockNumber
      }
      currency {
        id
        symbol
        decimals
        name
      }
      nfts {
        tokenId
      }
    }
  }
  `)

const nftQuery = gql(`
query ($contractAddress: Bytes!) {
    nfts (where: {contract:$contractAddress}, orderBy:tokenId, orderDirection:desc){
    tokenId
  }
}`)

export const contractAddress = writable(null)

contractAddress.subscribe(address => {
    if (address) {
        defaultEvmStores.attachContract(
            "nftContract",
            address,
            JSON.stringify(Vapour721AArtifact.abi)
        );
    }
})

// derived store for getting all the nft contract info from the subgraph

// increment this value to trigger the derived store again
const tick = writable(0)

// the derived store itself
const _contractInfo: Readable<any> = derived([contractAddress, tick], ([$contractAddress, $tick], set) => {
    if (client && $contractAddress) {
        Promise.all([
            client.query(query, { contractAddress: $contractAddress.toLowerCase() }).toPromise(),
            client.query(nftQuery, { contractAddress: $contractAddress.toLowerCase() }).toPromise()
        ]).then(([queryRes, nftQueryRes]) => {
            console.log(queryRes)
            let info = queryRes.data.vapour721A
            info.noOfNfts = nftQueryRes.data.nfts[0]?.tokenId || 0
            set(info)
        })
        client.query(nftQuery, { contractAddress: $contractAddress }).toPromise()
        client.query(query, { contractAddress: $contractAddress }).toPromise().then(res => {
            set(res.data.vapour721A)
        })
    }
})

// adding a method to the store object to refresh it
export const contractInfo = {
    ..._contractInfo,
    refresh: () => {
        tick.update(n => n + 1);
    }
}

// derived store for getting the nft contract currency
export const currency = derived(
    contractInfo,
    ($contractInfo, set) => {
        if ($contractInfo) {
            set($contractInfo.currency.id)
        }
    }
    , "");

export const reserveContract = writable(null)

// derived store for getting all the ERC20 info
export const currencyInfo = derived([signer, currency], ([$signer, $currency], set) => {
    if ($currency == ethers.constants.AddressZero && $signer) {
        $signer.getBalance().then(signerBalance => {
            set({
                isNative: true,
                address: $currency,
                name: "ETH",
                symbol: "ETH",
                decimals: ethers.BigNumber.from(18),
                signerBalance,
                signerBalanceFormatted: formatEther(signerBalance)
            })
        })
    } else if ($currency && $signer) {
        const contract = new ERC20($currency, $signer)
        reserveContract.set(contract)
        try {
            Promise.all([contract.name(), contract.symbol(), contract.decimals(), contract.balanceOf($signer.getAddress())]).then(res => {
                const [name, symbol, decimals, signerBalance] = res
                set({
                    isNative: false,
                    address: contract.address,
                    name,
                    symbol,
                    decimals,
                    signerBalance,
                    signerBalanceFormatted: formatUnits(signerBalance, decimals)
                })
            })
        } catch {
            toast.push('<span style="color:red">Something went wrong</span>')
        }
    }
}, null)

// subscribe so we get this asap
currencyInfo.subscribe(val => { })

// store for the targetUnits - once set it will create the quote
export const targetUnits = writable(null)

// derived store for calculating a full quote
let index = 0
export const quote = derived([targetUnits, signerAddress, contracts, currencyInfo], ([$targetUnits, $signerAddress, $contracts, $currencyInfo], set) => {
    index++;
    const oldIndex = index;

    if ($signerAddress && $contracts) {
        if (!$targetUnits) {
            set(null)
            return
        }
        set({ calculating: true })
        Promise.all([
            $contracts.nftContract.calculateBuy($signerAddress, $targetUnits),
            // artificially slowing down the response a little to prevent a flash
            new Promise(r => setTimeout(r, 700))
        ]).then(res => {
            const [{ maxUnits_, price_ }] = res
            const _targetUnits = BigNumber.from($targetUnits);
            const finalUnits = _targetUnits.gt(maxUnits_) ? maxUnits_ : _targetUnits;
            const totalPrice = BigNumber.from(finalUnits).mul(price_);
            const totalPriceFormatted = formatUnits(totalPrice, $currencyInfo.decimals);

            // only update the quote if this is the most recent request
            if (index == oldIndex) {
                set({
                    calculating: false,
                    signerBalance: $currencyInfo.signerBalance,
                    signerReserveBalanceFormatted: $currencyInfo.signerBalanceFormatted,
                    maxUnits: maxUnits_,
                    price: price_,
                    finalUnits,
                    totalPrice,
                    totalPriceFormatted,
                    targetUnits: _targetUnits,
                });
            }
        });
    }
}, null)

// derived store for getting native token balance
export const signerNativeBalance = derived([signer, connected], ([$signer, $connected], set) => {
    if ($connected && $signer) {
        $signer.getBalance().then(res => set(res))
    }
}, null)

// subscribe so we get this asap
signerNativeBalance.subscribe(val => { })