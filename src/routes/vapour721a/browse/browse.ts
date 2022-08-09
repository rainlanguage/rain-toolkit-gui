import { client } from "$routes/vapour721a/mint/mint";
import { gql } from "@urql/svelte";
import { derived, writable, type Readable } from "svelte/store";
import IPFSGatewayTools from "@pinata/ipfs-gateway-tools/dist/browser";

const queryBody = `{
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
  }`
const query = gql(`
query {
    vapour721As (orderBy: deployTimestamp, orderDirection: desc)
    ${queryBody}
  }
  `)

const queryByDeployer = gql(`
query ($deployer: Bytes!) {
    vapour721As(where: {deployer: $deployer}, orderBy: deployTimestamp, orderDirection: desc) 
    ${queryBody}
  }
  `)

export const deployer = writable(null)
export const page = writable(1)
const tick = writable(1)

const _listVapour721As: Readable<Array<any>> = derived([deployer, tick], ([$deployer, tick], set) => {
  if ($deployer) {
    client.query(queryByDeployer, { deployer: $deployer.toLowerCase() }, { requestPolicy: "network-only" }).toPromise().then(res => {
      set(res.data.vapour721As)
    })
  } else {
    client.query(query, null, { requestPolicy: "network-only" }).toPromise().then(res => {
      set(res.data.vapour721As)
    })
  }
}, [])

export const listVapour721As = { ..._listVapour721As, refresh: () => { tick.update(v => v + 1) } }

export const getMetadata = async (baseURI: string) => {
  const convertedGatewayUrl = new IPFSGatewayTools().convertToDesiredGateway(
    `${baseURI}/1.json`,
    "https://rain.mypinata.cloud"
  );
  const metadata = await (await fetch(convertedGatewayUrl)).json();
  const imgURL = new URL(metadata.image);
  if (imgURL.protocol == "ipfs:") {
    metadata.image = new IPFSGatewayTools().convertToDesiredGateway(
      metadata.image,
      "https://rain.mypinata.cloud"
    )
  }
  return metadata
}