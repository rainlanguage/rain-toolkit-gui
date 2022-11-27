
// import { ContractWrappers } from '@0x/contract-wrappers';
// import { LimitOrder } from '@0x/protocol-utils';
// import { BigNumber, hexUtils } from '@0x/utils';
// import { Web3Wrapper } from '@0x/web3-wrapper';  
// import { providerUtils } from '@0x/utils';

// import {  Web3ProviderEngine, SignerSubprovider } from '@0x/subproviders';





// tslint:disable-next-line:custom-no-magic-numbers
//  const ONE_SECOND_MS = 1000;
// tslint:disable-next-line:custom-no-magic-numbers
//  const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
// tslint:disable-next-line:custom-no-magic-numbers
//  const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
// tslint:disable-next-line:custom-no-magic-numbers
//  const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);
// // tslint:disable-next-line:custom-no-magic-numbers
//  const DECIMALS = 18;
//  const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
//  const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
//  const NULL_BYTES = '0x';
//  const ZERO = new BigNumber(0);
//  const GANACHE_NETWORK_ID = 50;
//  const KOVAN_NETWORK_ID = 42;
//  const ROPSTEN_NETWORK_ID = 3;
//  const RINKEBY_NETWORK_ID = 4;
//  const MOCK_0x_API_BASE_URL = 'https://mock.api.0x.org'; 



// const getRandomFutureDateInSeconds = (): BigNumber => {
//     return new BigNumber(Date.now() + TEN_MINUTES_MS).div(ONE_SECOND_MS).integerValue(BigNumber.ROUND_CEIL);
// };

// export async function placeLimitOrder(provider): Promise<void>{  
    
    
    // const providerEngine = new Web3ProviderEngine();
    
    // providerEngine.addProvider(new SignerSubprovider(provider));
   
    
    // providerUtils.startProviderEngine(providerEngine); 


    // const web3Wrapper = new Web3Wrapper(providerEngine);
    // const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
    
    // console.log("maker : " , maker)
   
    // const zrxAmount = new BigNumber(100);
    // // the amount of WETH involved in the trade
    // const wethAmount = new BigNumber(10); 

    // const randomExpiration = getRandomFutureDateInSeconds();
    // const pool = hexUtils.leftPad(1);  

    // const contractWrappers = new ContractWrappers(providerEngine, { chainId: 80001 });


    // const exchangeProxyAddress = contractWrappers.contractAddresses.exchangeProxy;
    // const zrxTokenAddress = contractWrappers.contractAddresses.zrxToken;
    // const etherTokenAddress = contractWrappers.contractAddresses.etherToken;

    // const sellZrxLimitOrder1: LimitOrder = new LimitOrder({
    //     chainId: 80001,
    //     verifyingContract: '0xf471d32cb40837bf24529fcf17418fc1a4807626',
    //     maker : '0x658DB9eC9B452c6eEbAa4b248B34bf62B6B92981',
    //     makerToken: '0x333ed7DAD058090645Ccf59b33919B3d3295200C',
    //     takerToken: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    //     makerAmount: zrxAmount,
    //     takerAmount: wethAmount,
    //     takerTokenFeeAmount: ZERO,
    //     sender: NULL_ADDRESS,
    //     feeRecipient: NULL_ADDRESS,
    //     expiry: randomExpiration,
    //     pool,
    //     salt: new BigNumber(1),
    // });  





// }  



// import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses' 





