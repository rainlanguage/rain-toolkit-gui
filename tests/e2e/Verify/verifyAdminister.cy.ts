import { slowCypressDown } from 'cypress-slow-down'

slowCypressDown(1000)

describe('Verify/ VerifyTier : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Verify').click()
        cy.contains('Administer a Verify').click()
        cy.get('input').type("0x848f5408c7057b7e17e3ea796c2544a1f95e90a2") //change input value according to your convenience
        cy.contains("Load").click()
        cy.wait(1500)
    })

    it("Verify : Administer a Verify", () => {
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div.mt-8 > div > div.mb-4.flex.flex-row > a:nth-child(3)').click()
        cy.get('input').clear().type('0x5A2c9D2ABea0e11cEcE2026D8dECEb2234CB1022') //change input value according to your convenience
        cy.get('select').select('Approver') //change select value according to your convenience
        cy.contains('button', 'Grant role').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)

        //change '0x5A2c9D2ABea0e11cEcE2026D8dECEb2234CB1022' & 'Approver' according to your convenience
        cy.contains("0x5A2c9D2ABea0e11cEcE2026D8dECEb2234CB1022 has been granted role 'Approver'")
    })

    it("Verify : Administer a Verify", () => {
        // cy.importMetamaskAccount('9fb5526fd6cb68eef6f93da85d0e69d7ffecd17b76b4381574d4daf2f11a945d')
        // // cy.switchMetamaskAccount('0x5A2c9D2ABea0e11cEcE2026D8dECEb2234CB1022')
        // cy.switchMetamaskAccount(2)
        // cy.getMetamaskWalletAddress().then(address => cy.log(address))
        // cy.wait(25000)

        cy.get('textarea').clear().type('0x5A2c9D2ABea0e11cEcE2026D8dECEb2234CB1022') //change input value according to your convenience
        cy.get('textarea').type('{enter}')
        cy.get('textarea').type('0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440') //change input value according to your convenience
        cy.contains('button', 'Approve').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains("Addresses approved.")
    })

})