describe('Emissions : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Emissions').click()
        cy.contains('Claim an EmissionsERC20').click()
        cy.get('input').type("0x08430a6667a7a01a05dffff885285e85ec0e18f8")
        cy.contains("Load").click()
        cy.wait(1500)
    })

    // after(() => {
    //     cy.disconnectMetamaskWalletFromDapp()
    // })

    it("Emission : Claim an Emission", () => {
        cy.contains('0x0843...18f8')
        cy.contains('button', 'Calculate').click()
        cy.wait(1500)
        cy.contains('button', 'Claim').click()
        cy.confirmMetamaskTransaction()
        cy.wait(20000)
        cy.contains("Claim complete! Refresh to see your new balance.")
    })

    it("Emission : Claim an Emission", () => {
        cy.contains('div', 'Total supply:')
        cy.contains('div', '5000.0')
    })

})