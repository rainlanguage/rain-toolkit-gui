import { slowCypressDown } from 'cypress-slow-down'

slowCypressDown(1000)

describe('Stake : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Stake').click()
    })

    it('Stake : Browse all deployed stake', () => {
        cy.contains('Browse deployed Stakes').click()
        cy.wait(1500)
        cy.scrollTo("bottom", { duration: 3000, easing: "swing" })
    })

    it("Stake : Deploy Stake", () => {
        cy.contains('Deploy a Stake').click()
        cy.get('input[placeholder="Token address"]').clear().type('0x5ea6a3E93D3A81F0322dE49a22b27E18dbD16A51')  //change input value according to your convenience
        cy.get('input[placeholder="Name"]').clear().type('Test Token')  //change input value according to your convenience
        cy.get('input[placeholder="Symbol"]').clear().type('tTKN')  //change input value according to your convenience
        cy.get('input[placeholder="Initial Ratio"]').clear().type('2')  //change input value according to your convenience
        cy.contains('button', 'Deploy Stake').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('New Stake deployed!')
    })
})