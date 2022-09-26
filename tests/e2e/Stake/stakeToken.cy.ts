describe('Stake : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Stake').click()
        cy.contains('Stake tokens').click()
        cy.get('input').type("0x9091a553d42e3291f08a0b093700bf133f58906a")
        cy.contains("Load").click()
        cy.wait(1500)
    })

    // after(() => {
    //     cy.disconnectMetamaskWalletFromDapp()
    // })

    it.skip(`Select Stake from List Stake Page`, () => {
        cy.contains('Stake').click()
        cy.contains('Browse deployed Stakes').click()
        cy.wait(3000)
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(1) > div.flex.flex-row.gap-x-2 > button:nth-child(1)').click()
        cy.wait(3000)
        cy.contains('span', 'Contract Address: 0x9091a553d42e3291f08a0b093700bf133f58906a')
    })

    it("Stake : Deposit in Stake", () => {
        cy.contains('button', 'Deposit').click()
        cy.get('body > div.fixed.top-0.left-0.w-screen.h-screen.flex.flex-col.justify-center.bg-gray-900.bg-opacity-75.z-50.backdrop-blur.s-_bRanQFElcIc > div > div > div > div > div.flex.w-full.flex-col.gap-y-2 > div.flex.w-full.flex-row.items-center.gap-x-2.self-stretch > input').type('1')
        cy.wait(1000)
        cy.contains('button', 'Approve Amount').click()
        cy.confirmMetamaskPermissionToSpend() //use when you need token to spend
        cy.wait(25000)
        cy.contains('button', 'Ok').click()
        cy.contains('button', 'Deposit').click()
        cy.confirmMetamaskTransaction()
        cy.wait(20000)
        cy.contains('button', 'Ok').click()
        cy.contains("Deposit confirmed!")
    })

    it("Stake : Withdraw from Stake", () => {
        cy.contains('button', 'Withdraw').click()
        cy.get('body > div.fixed.top-0.left-0.w-screen.h-screen.flex.flex-col.justify-center.bg-gray-900.bg-opacity-75.z-50.backdrop-blur.s-_bRanQFElcIc > div > div > div > div > div.flex.w-full.flex-col.gap-y-2 > div.flex.w-full.flex-row.items-center.gap-x-2.self-stretch > input').type('1')
        cy.wait(500)
        cy.contains('button', 'Withdraw Amount').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains('button', 'Ok').click()
        cy.contains("Withdraw confirmed!")
    })

    it("Stake : Report for all Tier for my Address", () => {
        cy.contains('button', 'Report').click()
        cy.wait(1500)
        cy.get('input[placeholder="Tier 1"]').type('1')
        cy.get('input[placeholder="Tier 2"]').type('2')
        cy.get('input[placeholder="Tier 3"]').type('3')
        cy.get('input[placeholder="Tier 4"]').type('4')
        cy.get('input[placeholder="Tier 5"]').type('5')
        cy.get('input[placeholder="Tier 6"]').type('6')
        cy.get('input[placeholder="Tier 7"]').type('7')
        cy.get('input[placeholder="Tier 8"]').type('8')
        cy.contains('button', 'Get my report').click()
        cy.wait(1000)
        cy.contains("Tier 1 : 1 ✅")
    })

})