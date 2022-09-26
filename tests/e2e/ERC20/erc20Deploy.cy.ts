import { slowCypressDown } from 'cypress-slow-down'

slowCypressDown(1000)

describe('ERC20 : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Deploy ERC20').click()
        cy.contains('Deploy an ERC20 Token').click()
    })

    // after(() => {
    //     cy.disconnectMetamaskWalletFromDapp()
    // })

    it(`ERC20 : Deploy an ERC20 token with default Configuration`, () => {
        cy.contains('button', 'Deploy ERC20 Token').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('New ERC20 Token deployed!')
    })

    it(`ERC20 : Deploy an ERC20 token with custom input Configuration`, () => {
        cy.get('input[placeholder="Name"]').clear().type('Test Token')
        cy.get('input[placeholder="Symbol"]').clear().type('tTKN')
        cy.get('input[placeholder="Owner Address"]').clear().type('0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440')
        cy.get('input[placeholder="Total Supply"]').clear().type('2000')
        cy.contains('button', 'Deploy ERC20 Token').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('New ERC20 Token deployed!')
    })

    it(`ERC20 : Deploy an ERC20 token with custom Supply Control Configuration`, () => {
        // cy.get('input[placeholder="Name"]').clear().type('Test Token')
        // cy.get('input[placeholder="Symbol"]').clear().type('tTKN')
        // cy.get('input[placeholder="Owner Address"]').clear().type('0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440')
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div > div:nth-child(3) > div > label > span').click()
        cy.get('input[placeholder="Initial Supply"]').clear().type('1000')
        cy.get('input[placeholder="Fixed Supply"]').clear().type('2000')
        cy.contains('button', 'Deploy ERC20 Token').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('New ERC20 Token deployed!')
    })

    it(`ERC20 : Deploy an ERC20 token with custom Faucets Configuration`, () => {
        // cy.get('input[placeholder="Name"]').clear().type('Test Token')
        // cy.get('input[placeholder="Symbol"]').clear().type('tTKN')
        // cy.get('input[placeholder="Owner Address"]').clear().type('0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440')
        cy.get('input[placeholder="Total Supply"]').clear().type('2000')

        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div > div:nth-child(4) > div:nth-child(1) > label > span').click()
        cy.get('input[placeholder="Number of blocks"]').clear().type('200')
        cy.get('input[placeholder="Number of token(units)"]').clear().type('1')
        cy.contains('button', 'Deploy ERC20 Token').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('New ERC20 Token deployed!')
    })

    it(`ERC20 : Deploy an ERC20 token with all custom Configuration`, () => {
        cy.get('input[placeholder="Name"]').clear().type('Test Token')
        cy.get('input[placeholder="Symbol"]').clear().type('tTKN')
        cy.get('input[placeholder="Owner Address"]').clear().type('0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440')

        //Supply Control Configuration
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div > div:nth-child(3) > div > label > span').click()
        cy.get('input[placeholder="Initial Supply"]').clear().type('1000')
        cy.get('input[placeholder="Fixed Supply"]').clear().type('2000')

        //Faucets Configuration
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div > div:nth-child(4) > div:nth-child(1) > label > span').click()
        cy.get('input[placeholder="Number of blocks"]').clear().type('200')
        cy.get('input[placeholder="Number of token(units)"]').clear().type('1')

        cy.contains('button', 'Deploy ERC20 Token').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('New ERC20 Token deployed!')
    })
})
