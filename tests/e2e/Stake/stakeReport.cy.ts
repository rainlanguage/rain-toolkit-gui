import { slowCypressDown } from 'cypress-slow-down'

slowCypressDown(1000)

describe('Stake : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Stake').click()
        cy.contains('Check a Stake Report').click()
        cy.get('input').type("0x9091a553d42e3291f08a0b093700bf133f58906a") //change input value according to your convenience
        cy.contains("Load").click()
        cy.wait(1500)
    })

    it.skip(`Select Stake from List Stake Page`, () => {
        cy.contains('Stake').click()
        cy.contains('Browse deployed Stakes').click()
        cy.wait(3000)
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(1) > div.flex.flex-row.gap-x-2 > button:nth-child(2)').click()
        cy.wait(3000)
    })

    it("Stake : Report for all Tier for my Address", () => {
        cy.get('input[placeholder="Tier 1"]').type('1') //change input value according to your convenience
        cy.get('input[placeholder="Tier 2"]').type('2') //change input value according to your convenience
        cy.get('input[placeholder="Tier 3"]').type('3') //change input value according to your convenience
        cy.get('input[placeholder="Tier 4"]').type('4') //change input value according to your convenience
        cy.get('input[placeholder="Tier 5"]').type('5') //change input value according to your convenience
        cy.get('input[placeholder="Tier 6"]').type('6') //change input value according to your convenience
        cy.get('input[placeholder="Tier 7"]').type('7') //change input value according to your convenience
        cy.get('input[placeholder="Tier 8"]').type('8') //change input value according to your convenience
        cy.contains('button', 'Get my report').click()
        cy.wait(1000)
        cy.contains("Tier 1 : 1 ✅") //change according to your convenience
    })

    it("Stake : Report for Single Tier for my Address", () => {
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div.flex.flex-col.items-start.gap-y-4.rounded-xl.bg-gray-800.p-8.drop-shadow-sm.filter > div:nth-child(3) > label > span').click()
        cy.get('select').select('Tier 3')
        cy.get('input[placeholder="Tier 1"]').type('1') //change input value according to your convenience
        cy.get('input[placeholder="Tier 2"]').type('2') //change input value according to your convenience
        cy.get('input[placeholder="Tier 3"]').type('3') //change input value according to your convenience
        cy.get('input[placeholder="Tier 4"]').type('4') //change input value according to your convenience
        cy.get('input[placeholder="Tier 5"]').type('5') //change input value according to your convenience
        cy.get('input[placeholder="Tier 6"]').type('6') //change input value according to your convenience
        cy.get('input[placeholder="Tier 7"]').type('7') //change input value according to your convenience
        cy.get('input[placeholder="Tier 8"]').type('8') //change input value according to your convenience
        cy.contains('button', 'Get my report').click()
        cy.wait(1000)
        cy.contains("Tier 1 : 3 ❌") //change according to your convenience
    })

    it("Stake : Report for all Tier for Other Address", () => {
        cy.get('input[placeholder="Enter an Ethereum address"]').type('0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440') //change input value according to your convenience
        cy.get('input[placeholder="Tier 1"]').type('1') //change input value according to your convenience
        cy.get('input[placeholder="Tier 2"]').type('2') //change input value according to your convenience
        cy.get('input[placeholder="Tier 3"]').type('3') //change input value according to your convenience
        cy.get('input[placeholder="Tier 4"]').type('4') //change input value according to your convenience
        cy.get('input[placeholder="Tier 5"]').type('5') //change input value according to your convenience
        cy.get('input[placeholder="Tier 6"]').type('6') //change input value according to your convenience
        cy.get('input[placeholder="Tier 7"]').type('7') //change input value according to your convenience
        cy.get('input[placeholder="Tier 8"]').type('8') //change input value according to your convenience
        cy.contains('button', 'Get report').click()
        cy.wait(1000)
        cy.contains("Tier 1 : 1 ❌") //change according to your convenience
    })

    it("Stake : Report for Single Tier for Other Address", () => {
        cy.get('input[placeholder="Enter an Ethereum address"]').type('0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440') //change input value according to your convenience
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div.flex.flex-col.items-start.gap-y-4.rounded-xl.bg-gray-800.p-8.drop-shadow-sm.filter > div:nth-child(3) > label > span').click()
        cy.get('select').select('Tier 1')
        cy.get('input[placeholder="Tier 1"]').type('1') //change input value according to your convenience
        cy.get('input[placeholder="Tier 2"]').type('2') //change input value according to your convenience
        cy.get('input[placeholder="Tier 3"]').type('3') //change input value according to your convenience
        cy.get('input[placeholder="Tier 4"]').type('4') //change input value according to your convenience
        cy.get('input[placeholder="Tier 5"]').type('5') //change input value according to your convenience
        cy.get('input[placeholder="Tier 6"]').type('6') //change input value according to your convenience
        cy.get('input[placeholder="Tier 7"]').type('7') //change input value according to your convenience
        cy.get('input[placeholder="Tier 8"]').type('8') //change input value according to your convenience
        cy.contains('button', 'Get report').click()
        cy.wait(1000)
        cy.contains("Tier 1 : 1 ❌") //change according to your convenience
    })

})