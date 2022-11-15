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
    blockExplorerUrls: ['https://polygonscan.com/']
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
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
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
    tokenAddress : '0x3b55b7b2Eec07cf5F0634B130eFbb1A1e4eDEd0a',
    tokenName : "USD Classic",
    tokenSymbol : "USDCC", 
    logo : '../../../assets/usdcc.svg'
  },
  {
    tokenAddress : '0x8204Cfc5d4F773fD3F422d28AA494E9FA5680cc7',
    tokenName : "USD Tether",
    tokenSymbol : "USDT" ,
    logo : '../../../assets/usdt.svg'

  }, 
  {
    tokenAddress : '0x333ed7DAD058090645Ccf59b33919B3d3295200C',
    tokenName : "BUSD Token",
    tokenSymbol : "BUSD",
    logo : '../../../assets/busd.svg'

  }, 



  {
    tokenAddress : '0xA6565a4Cf2fB6631A30DfF3EAe2ebb534Acd2F4e',
    tokenName : "Dai Stablecoin",
    tokenSymbol : "DAI",
    logo : '../../../assets/dai.svg'
  }   ,

  {
    tokenAddress : '0xda83AD4e50C0Ac341969C180887638250839BE10',
    tokenName : "Pax Dollar",
    tokenSymbol : "PUSD",
    logo : '../../../assets/PUSD.svg'
  }  ,

  {
    tokenAddress : '0xD992E6d765c28f0a8c56ACd3a2B5A6c66714a743',
    tokenName : "Gemini Dollar",
    tokenSymbol : "GUSD",
    logo : '../../../assets/GUSD.svg'
  }  ,

  
  {
    tokenAddress : '0x3cb8008e33bb02BDdb0badc67454750e5BddF146',
    tokenName : "Decentralized USD",
    tokenSymbol : "USDD",
    logo : '../../../assets/USDD.svg'
  }  ,

  {
    tokenAddress : '0xF615F6837daBF7FDC536cdE6DaeB9CfBF1A458ad',
    tokenName : "MindsyncAI",
    tokenSymbol : "MAI",
    logo : '../../../assets/logo_.svg'
  }  ,

  {
    tokenAddress : '0x7394E875CC4776A66Ecd5F7BcDf75BbFdd7F5165',
    tokenName : "xDAI",
    tokenSymbol : "xDAI",
    logo : '../../../assets/logo_.svg'
  }  ,

  
  {
    tokenAddress : '0xB4e46F1fb5af51A785aFac60f081F1473bD63781',
    tokenName : "LUSD Stablecoin",
    tokenSymbol : "LUSD",
    logo : '../../../assets/logo_.svg'
  }   ,

  {
    tokenAddress : '0xa866dF2d90368961c3eBB0415268985604799b16',
    tokenName : "mStable USD",
    tokenSymbol : "mUSD",
    logo : '../../../assets/logo_.svg'
  }  ,

  {
    tokenAddress : '0x562EBa9748eE888c3D7a63F63510ECFA8aFd3ea1',
    tokenName : "Fei USD",
    tokenSymbol : "FEI",
    logo : '../../../assets/FEI.svg'
  }  , 

  {
    tokenAddress : '0xfF37EC6c19EA8BD339e07857396bCa86109dA851',
    tokenName : "Alchemix USD",
    tokenSymbol : "alUSD",
    logo : '../../../assets/logo_.svg'
  }  , 

  {
    tokenAddress : '0x3AB7f2170DEf34dFF15aD14A4356ADfbB85B9d7C',
    tokenName : "Frax",
    tokenSymbol : "FRAX",
    logo : '../../../assets/FRAX.svg'
  }  , 

  {
    tokenAddress : '0x9DD1e94798f768bd7Ee06d4f4F0F3fB096492116',
    tokenName : " CUSD",
    tokenSymbol : "CUSD",
    logo : '../../../assets/logo_.svg'
  }  , 

  

  {
    tokenAddress:"0x755c2a7e5429d53F5eE58F5Af41ECC66C4Eb0394",
    tokenName:"Magic Internet Money",
    tokenSymbol:"MIM",
    logo :"../../../assets/MIM.svg"
}
 
 
 
  

  
  

]