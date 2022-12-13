import WalletConnect from "@walletconnect/web3-provider/dist/umd/index.min";
import Fortmatic from "fortmatic";

// Example for Polygon/Matic:
const customNetworkOptions = {
  rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  chainId: 80001
}

export const providerOptions = {
  injected: {
    display: {
      name: "Metamask",
      description: "Connect with the provider in your Browser"
    },
    package: null
  },
  fortmatic: {
    package: Fortmatic, // required
    options: {
      key: "pk_live_1BE6BBD3BEAFCDDD", // required
      network: customNetworkOptions // if we don't pass it, it will default to localhost:8454
    }
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: "0f270373e0934beda174c537257386b0",
      rpc: {
        80001: "https://matic-mumbai.chainstacklabs.com",
        137: "https://polygon-rpc.com"
      },
    }
  },
  binancechainwallet: {
    package: true
  },
};


export const networks = [{
  label: "Polygon",
  config: {
    chainId: '0x89',
    chainName: 'Polygon',
    rpcUrls: ['https://polygon-rpc.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC', // 2-6 characters long
      decimals: 18
    },
    blockExplorerUrls: ['https://polygonscan.com/'],
    icon: 'polygon',
  },
  blockExplorer: 'https://polygonscan.com/'
},
{
  label: "Mumbai",
  config: {
    chainId: '0x13881',
    chainName: 'Mumbai',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC', // 2-6 characters long
      decimals: 18
    },
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    icon: 'polygon',
  },
  blockExplorer: 'https://mumbai.polygonscan.com/'
},
// {
//   label: "Avalanche Testnet",
//   config: {
//     chainId: '0xA869',
//     chainName: 'Avalanche Testnet C-Chain',
//     rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
//     nativeCurrency: {
//       name: 'Avalanche',
//       symbol: 'AVAX',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://testnet.snowtrace.io/']
//   },
//   blockExplorer: 'https://testnet.snowtrace.io/'
// },
// {
//   label: "BSC - Testnet",
//   config: {
//     chainId: "0x61",
//     chainName: 'BSC - Testnet',
//     rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
//     nativeCurrency: {
//       name: 'Binance Coin',
//       symbol: 'BNB',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://testnet.bscscan.com']
//   },
//   blockExplorer: 'https://testnet.bscscan.com'
// },
// {
//   label: "BSC - Mainnet",
//   config: {
//     chainId: "0x38",
//     chainName: 'BSC',
//     rpcUrls: ['https://bsc-dataseed.binance.org/'],
//     nativeCurrency: {
//       name: 'Binance Coin',
//       symbol: 'BNB',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://bscscan.com/']
//   },
//   blockExplorer: 'https://bscscan.com/'
// },
// {
//   label: "Ethereum",
//   config: {
//     chainId: "0x1",
//     chainName: 'Ethereum',
//     rpcUrls: ['https://eth-mainnet.public.blastapi.io'],
//     nativeCurrency: {
//       name: 'Ethereum',
//       symbol: 'ETH',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://etherscan.io/']
//   },
//   blockExplorer: 'https://etherscan.io/'
// },
// {
//   label: "Fantom - Testnet",
//   config: {
//     chainId: "0xfa2",
//     chainName: 'Fantom - Testnet',
//     rpcUrls: ['https://rpc.testnet.fantom.network'],
//     nativeCurrency: {
//       name: 'Fantom',
//       symbol: 'FTM',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://testnet.ftmscan.com']
//   }
// },
// {
//   label: "Ropsten",
//   config: {
//     chainId: "0x3",
//     chainName: 'Ropsten',
//     rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
//     nativeCurrency: {
//       name: 'Ropsten',
//       symbol: 'ETH',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://ropsten.etherscan.io/']
//   }
// },
// {
//   label: "Rinkeby",
//   config: {
//     chainId: "0x4",
//     chainName: 'Rinkeby',
//     rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
//     nativeCurrency: {
//       name: 'Rinkeby',
//       symbol: 'ETH',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://rinkeby.etherscan.io']
//   }
// },
// {
//   label: "Goerli",
//   config: {
//     chainId: "0x5",
//     chainName: 'Goerli',
//     rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
//     nativeCurrency: {
//       name: 'Goerli',
//       symbol: 'ETH',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://goerli.etherscan.io']
//   },
//   blockExplorer: 'https://goerli.etherscan.io'
// },
// {
//   label: " Kovan",
//   config: {
//     chainId: "0x2a",
//     chainName: ' Kovan',
//     rpcUrls: ['https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
//     nativeCurrency: {
//       name: ' Kovan',
//       symbol: 'ETH',
//       decimals: 18
//     },
//     blockExplorerUrls: ['https://kovan.etherscan.io']
//   }
// }
]

export const tokenAddressess = [
  {
    tokenAddress : '0x121f36F697318f2b3B03D52bCfa663296eB3F1aB',
    tokenName : "USD Classic", 
    tokenSymbol : "USDC",  
    decimals : 6 ,
    logo : 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389'
  },
  {
    tokenAddress : '0x46C810A527880abCE511873f5ECd3FDd9D86aE5A',
    tokenName : "USD Tether",
    tokenSymbol : "USDT" , 
    decimals : 6 ,
    logo : 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png?1668148663'

  }, 
  {
    tokenAddress : '0x67696314fFD98ae763923C775173B6E8b24B7eFc',
    tokenName : "Binance USD",
    tokenSymbol : "BUSD", 
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766'

  },
  {
    tokenAddress : '0xA6565a4Cf2fB6631A30DfF3EAe2ebb534Acd2F4e',
    tokenName : "Dai Stablecoin",
    tokenSymbol : "DAI",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734'
  },
  {
    tokenAddress : '0xda83AD4e50C0Ac341969C180887638250839BE10',
    tokenName : "Pax Dollar",
    tokenSymbol : "PUSD",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/25858/thumb/PUSd.png?1654161232'
  },
  {
    tokenAddress : '0x6fb47a59588611c95dDC3A9f8f7A10FF2216d3b5',
    tokenName : "Gemini Dollar",
    tokenSymbol : "GUSD", 
    decimals : 2 ,
    logo : 'https://assets.coingecko.com/coins/images/5992/thumb/gemini-dollar-gusd.png?1536745278'
  },
  {
    tokenAddress : '0x3cb8008e33bb02BDdb0badc67454750e5BddF146',
    tokenName : "Decentralized USD",
    tokenSymbol : "USDD",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/25380/thumb/UUSD.jpg?1651823371'
  },
  {
    tokenAddress : '0xF615F6837daBF7FDC536cdE6DaeB9CfBF1A458ad',
    tokenName : "MindsyncAI",
    tokenSymbol : "MAI",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/7581/thumb/mindsync-logo.jpg?1548636745'
  },
  {
    tokenAddress : '0xD43d5D8F50F49e3C54fC634f8B96156e850E24Ce',
    tokenName : "STAKE",
    tokenSymbol : "STAKE",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/11061/thumb/xdai.png?1587714165'
  },
  {
    tokenAddress : '0xB4e46F1fb5af51A785aFac60f081F1473bD63781',
    tokenName : "LUSD Stablecoin",
    tokenSymbol : "LUSD",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327'
  },
  {
    tokenAddress : '0xa866dF2d90368961c3eBB0415268985604799b16',
    tokenName : "mStable USD",
    tokenSymbol : "MUSD",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/11576/thumb/mStable_USD.png?1595591803'
  },
  {
    tokenAddress : '0x562EBa9748eE888c3D7a63F63510ECFA8aFd3ea1',
    tokenName : "Fei USD",
    tokenSymbol : "FEI",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/14570/thumb/ZqsF51Re_400x400.png?1617082206'
  },
  {
    tokenAddress : '0xfF37EC6c19EA8BD339e07857396bCa86109dA851',
    tokenName : "Alchemix USD",
    tokenSymbol : "ALUSD",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/14114/thumb/Alchemix_USD.png?1614410406'
  },
  {
    tokenAddress : '0x3AB7f2170DEf34dFF15aD14A4356ADfbB85B9d7C',
    tokenName : "Frax",
    tokenSymbol : "FRAX",
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/13423/thumb/frax_share.png?1608478989'
  },
  {
    tokenAddress : '0x9DD1e94798f768bd7Ee06d4f4F0F3fB096492116',
    tokenName : " CUSD",
    tokenSymbol : "CUSD",  
    decimals : 18 ,
    logo : 'https://assets.coingecko.com/coins/images/11621/thumb/cUSDT.png?1592113270'
  },
  {
    tokenAddress:"0x755c2a7e5429d53F5eE58F5Af41ECC66C4Eb0394",
    tokenName:"Magic Internet Money",
    tokenSymbol:"MIM",
    decimals : 18 ,
    logo :"https://assets.coingecko.com/coins/images/15264/thumb/mimatic-red.png?162028101"
  },
  {
    tokenAddress:"0xfA933e866B2089D9DD019556D771f6A692c3fcb5",
    tokenName:"True USD",
    tokenSymbol:"TUSD",
    decimals : 18 ,
    logo :"https://assets.coingecko.com/coins/images/3449/thumb/tusd.png?1618395665"
  }
]