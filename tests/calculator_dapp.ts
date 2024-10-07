import assert from "assert"
import * as anchor from "@coral-xyz/anchor"

describe("calculator-dapp", () => {
    const provider = anchor.AnchorProvider.local()
    anchor.setProvider(provider)

    const calculator = anchor.web3.Keypair.generate()
    const program = anchor.workspace.calculator_dapp

    it("Initialize Calculator", async () => {

        const message = "Welcome to Calculator!"
        await program.rpc.create(message, {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [calculator],
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.greeting === message)
    })

    it("Add two numbers", async () => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(5)))
    })

    it("Subtract two numbers", async () => {
        await program.rpc.sub(new anchor.BN(5), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(2)))
    })

    it("Multiply two numbers", async () => {
        await program.rpc.mul(new anchor.BN(5), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(15)))
    })

    it("Divide two numbers", async () => {
        await program.rpc.div(new anchor.BN(10), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(3)))
        assert.ok(account.remainder.eq(new anchor.BN(1)))
    })
})
