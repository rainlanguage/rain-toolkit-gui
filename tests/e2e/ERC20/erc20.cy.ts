import { slowCypressDown } from 'cypress-slow-down'

slowCypressDown(1000)

describe('ERC20 : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Deploy ERC20').click()
        cy.contains('Mint From An Existing ERC20').click()
    })

    it.skip(`ERC20 : Select ERC20 Tokens from List of All ERC20 Tokens Page`, () => {
        cy.contains('Deploy ERC20').click()
        cy.contains('List ERC20 Tokens').click()
        cy.wait(3000)
        cy.get('div.flex.flex-col.gap-y-3 > div:nth-child(4) > div.flex.flex-row.gap-x-2 > button').click() // change child value according to your deployer address component  
        cy.wait(4000)
        cy.contains('button', 'Show').click()
        cy.wait(3000)
        cy.contains('Mintable amount will be 0.0 MyTKN') // change '0.0 MyTKN' according to your mintable value and token symbol
    })

    it.skip(`ERC20 : Select ERC20 Tokens from List of Faucets Page`, () => {
        cy.contains('Deploy ERC20').click()
        cy.contains('List ERC20 Tokens').click()
        cy.wait(1000)
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div.flex.flex-col.py-4 > div > div > label > span').click()
        cy.wait(1000)
        cy.get('div.flex.flex-col.gap-y-3 > div:nth-child(1) > div.flex.flex-row.gap-x-2 > button').click() //change child value according to your convenience
        cy.wait(2000)
        cy.contains('button', 'Show').click()
        cy.wait(2000)
        cy.contains('button', 'Claim').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('Mint complete! Refresh to see your new balance.')
    })

    it(`ERC20 : Show details of ERC20 Token`, () => {
        cy.get('input').type("0x56f16bc1cd654c51bfc9a601cb1581b65fabfc22") //change input value according to your convenience
        cy.contains("Load").click()
        cy.wait(3000)
        cy.contains('button', 'Show').click()
        cy.wait(3000)
        cy.contains('Mintable amount will be 0.0 MyTKN') // change '0.0 MyTKN' according to your mintable value and token symbol
    })

    it(`ERC20 : Show details of Faucet`, () => {
        cy.get('input').type("0xd9c0232dcff5acd386473df9960937c9f95a7564") //change input value according to your convenience
        cy.contains("Load").click()
        cy.wait(3000)
        cy.contains('button', 'Show').click()
        cy.wait(2000)
        cy.contains('button', 'Claim').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('Mint complete! Refresh to see your new balance.')
    })


})