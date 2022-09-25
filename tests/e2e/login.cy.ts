import { slowCypressDown } from 'cypress-slow-down'

slowCypressDown(1000)

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
    // })

    it(`Home Page`, () => {
        cy.contains('MUMBAI - 0x5A2c...1022') // change it to your account address
    })

    // it('Sale: Deploy Sale with Default Value', () => {
    //     cy.contains('Sale').click()
    //     cy.contains('Deploy a Sale').click()

    //     cy.get('select').wait(1500).select('Fixed Price', { timeout: 10000 })
    //     // cy.get('option').contains('Fixed Price').then(option => {

    //     //     // Confirm have correct option
    //     //     cy.wrap(option).contains('Fixed Price');

    //     //     option[0].click();  // this is jquery click() not cypress click()

    //     //     // After click, md-select should hold the text of the selected option
    //     //     cy.get('[name="sales"]').contains('Fixed Price')
    //     // });
    //     cy.wait(200000)
    //     // cy.get('input[placeholder="Token address"]').type('0x5ea6a3E93D3A81F0322dE49a22b27E18dbD16A51')
    //     // cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div.z-10.flex.w-3\/5.flex-col.gap-y-4.s-otPzyJp8oo7m > div.z-10.flex.flex-col.items-start.gap-y-4.rounded-xl.bg-gray-800.p-8.drop-shadow-sm.filter > span.z-20.flex.w-full.flex-col.gap-y-3.s-otPzyJp8oo7m > span:nth-child(2) > input:nth-child(2)').type('2022-10-18 18:33')
    // })
})
