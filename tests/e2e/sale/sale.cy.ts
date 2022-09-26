
describe('Sale : Rain Protocol Toolkit', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5173')
        cy.contains('Connect Wallet').click()
        cy.contains('Metamask').click()
        cy.contains('Sale').click()
        cy.contains('Purchase rTKN from a Sale').click()
        cy.get('input').type("0x4be0ee50519a854a1e69fdf48e9302cd5d569efa")

        //0x5d52a7040066ac03f3efc72d9097626733f5c345
        cy.contains("Load").click()
        cy.wait(1500)

    })

    after(() => {
        cy.disconnectMetamaskWalletFromDapp()
    })

    it.skip(`Select Sale from List Sale Page`, () => {
        cy.contains('Sale').click()
        cy.contains('List deployed Sales').click()
        cy.wait(3000)
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(1) > div.flex.flex-row.gap-x-2 > button').click()
        cy.wait(3000)
        cy.contains('td', 'Active')
        cy.contains("Start sale").click()
        cy.wait(1000)
        cy.contains("execution reverted: NOT_PENDING")
    })

    it(`Sale : Start Sale Check`, () => {
        cy.contains("Start sale").click()
        cy.wait(1000)
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(2) > div.grid.w-full.grid-cols-2.items-start > table.table-auto > tr:nth-child(1) > td:nth-child(2)').invoke('text').then(text => {
            if (text == 'Active')
                cy.contains("execution reverted: NOT_PENDING")
            else {
                cy.confirmMetamaskTransaction()
                cy.wait(15000)
                cy.contains("Started!")
            }
        })
    })

    it(`Sale : End Sale Check`, () => {
        cy.contains("End sale").click()
        cy.wait(1000)
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(2) > div.grid.w-full.grid-cols-2.items-start > table.table-auto > tr:nth-child(1) > td:nth-child(2)').invoke('text').then(text => {
            if (text == 'Sucess' || text == 'Fail')
                cy.contains("execution reverted: NOT_ACTIVE")
            else {
                // change according to the sale ending date
                cy.confirmMetamaskTransaction()
                cy.wait(15000)
                cy.contains("Ended!")
                // -----------------------

                // cy.contains('execution reverted: LIVE')
            }
        })


    })

    it(`Sale : Buy reserve token`, () => {
        cy.get('button').invoke('text').then((text) => {
            let butName = text.match('Buy') || text.match('Approve')

            if (butName[0] == 'Approve') {
                cy.contains("button", "Approve").click()
                cy.wait(500)
                cy.contains('button', 'Approve').click()
                cy.confirmMetamaskPermissionToSpend() //use when you need token to spend
                cy.wait(25000)
                cy.contains("Approval confirmed.")
            } else if (butName[0] == 'Buy') {
                cy.contains("button", "Buy").click()
                cy.wait(1000)
                cy.get('body > div.fixed.top-0.left-0.w-screen.h-screen.flex.flex-col.justify-center.bg-gray-900.bg-opacity-75.z-50.backdrop-blur.s-_bRanQFElcIc > div > div > div > div > div.flex.w-full.flex-col.gap-y-2 > div.flex.w-full.flex-row.items-center.gap-x-2.self-stretch > input').type('1')
                cy.wait(1500)
                cy.contains('button', 'Buy').click()
                cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(2) > div.grid.w-full.grid-cols-2.items-start > table.table-auto > tr:nth-child(1) > td:nth-child(2)').invoke('text').then(text => {
                    if (text == 'Active') {
                        cy.confirmMetamaskTransaction()
                        cy.wait(25000)
                        cy.contains('Purchase confirmed!')
                    } else {
                        cy.contains('execution reverted: NOT_ACTIVE')
                    }
                })
            }
        })

    })

    it("Sale : Refund rTKN from Transaction history Table", () => {
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(7) > div > table > tr:nth-child(2) > td.py-2.text-right > span').click()
        cy.contains('button', 'Approve').click()
        cy.confirmMetamaskPermissionToSpend() //use when you need token to spend
        cy.wait(25000)
        cy.contains('Confirm your refund.')
        cy.contains('button', 'Confirm').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains("Refund confirmed!")
    })

    it("Sale : Deposit in Escrow", () => {
        cy.contains('button', 'Deposit').click()
        cy.wait(1000)
        cy.get('body > div.fixed.top-0.left-0.w-screen.h-screen.flex.flex-col.justify-center.bg-gray-900.bg-opacity-75.z-50.backdrop-blur.s-_bRanQFElcIc > div > div > div > div > div:nth-child(4) > div.flex.w-full.flex-row.items-center.gap-x-2.self-stretch > input').type('1')
        cy.contains('button', 'Approve Amount').click()
        cy.confirmMetamaskPermissionToSpend() //use when you need token to spend
        cy.wait(25000)
        cy.contains('button', 'Deposit').click()
        cy.confirmMetamaskTransaction()
        cy.wait(20000)
        cy.contains("Deposit confirmed!")
    })

    it("Sale : Withdraw from Escrow deposits claimable by rTKN holders Table", () => {
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(9) > div > table > tr:nth-child(4) > td.py-2.text-right > span').click()
        cy.contains('button', 'Confirm').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains("Withdraw confirmed!")
    })

    it("Sale : Undeposit from Escrow Undeposit History Table", () => {
        cy.get('body > main > div.w-full.py-5.px-8.s-XsEmFtvddWTw > div > div:nth-child(9) > div > table > tr:nth-child(2) > td.py-2.text-right > span').click()
        cy.get('body > div.fixed.top-0.left-0.w-screen.h-screen.flex.flex-col.justify-center.bg-gray-900.bg-opacity-75.z-50.backdrop-blur.s-_bRanQFElcIc > div > div > div > div > div.flex.w-full.flex-col.gap-y-2 > div.flex.w-full.flex-row.items-center.gap-x-2.self-stretch > input').type('1')
        cy.wait(1500)
        cy.contains('button', 'Confirm').click()
        cy.confirmMetamaskTransaction()
        cy.wait(25000)
        cy.contains("Undeposit confirmed!")
    })
})
