
describe('Rain Protocol Toolkit', () => {

    before(() => {
        cy.addMetamaskNetwork({ networkName: 'Mumbai', rpcUrl: 'https://rpc-mumbai.maticvigil.com', chainId: '80001', symbol: 'MATIC', blockExplorer: 'https://mumbai.polygonscan.com/', isTestnet: true });
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.acceptMetamaskAccess().then(connected => {
            expect(connected).to.be.true;
        });
    })

    // after(() => {
    //     cy.disconnectMetamaskWalletFromDapp()
    //     // cy.clear()
    // })

    it(`Home Page`, () => {
        cy.contains('MUMBAI - 0x5A2c...1022')
    })
})
