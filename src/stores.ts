import { createClient } from "@urql/svelte";
import { derived, writable } from "svelte/store";
import { networks } from "./constants";


export const selectedNetwork = writable(networks[1]);
export const client = derived(
  selectedNetwork,
  $selectedNetwork => createClient({
    url: "https://api.thegraph.com/subgraphs/name/siddharth2207/orderbook"
    // url: AddressBook.getSubgraphEndpoint(Number($selectedNetwork.config.chainId))
  })
)



