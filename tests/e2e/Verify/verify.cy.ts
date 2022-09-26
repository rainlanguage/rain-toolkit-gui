describe('Verify/ VerifyTier : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Verify').click()
        cy.contains('Deploy a Verify & VerifyTier').click()
    })

    it("Verify : Deploy a verify & VerifyTier", () => {
        cy.get('input[placeholder="Signer address"]').clear().type('0x5A2c9D2ABea0e11cEcE2026D8dECEb2234CB1022') //change input value according to your convenience
        cy.contains('button', 'Deploy Verify').click()
        cy.confirmMetamaskTransaction()
        cy.wait(20000)
        cy.contains("New Verify deployed!")
        cy.wait(500)
        cy.contains('button', 'Deploy VerifyTier').click()
        cy.confirmMetamaskTransaction()
        cy.wait(20000)
        cy.contains("New VerifyTier deployed!")
    })

})