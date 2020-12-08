#!/usr/bin/env node
const PocketJS = require("@pokt-network/pocket-js")
const Keybase = PocketJS.Keybase
const InMemoryKVStore = PocketJS.InMemoryKVStore
const { Command } = require('commander')
const program = new Command()

async function verifySignature(signerPublicKeyHex, payloadHex, signatureHex) {
    const keybase = new Keybase(new InMemoryKVStore())
    const signerPublicKeyBuf = Buffer.from(signerPublicKeyHex, "hex")
    const payloadBuf = Buffer.from(payloadHex, "hex")
    const signatureBuf = Buffer.from(signatureHex, "hex")
    const isValid = await keybase.verifySignature(signerPublicKeyBuf, payloadBuf, signatureBuf)
    return isValid
}

// Command implemented using action handler (description is supplied separately to `.command`)
// Returns new command for configuring.
program
    .command('verify-sign <payload> <publicKey> <signature>')
    .description('Verify a given <payload> in hex format was signed using the account <publicKey> in hex format, producing the <signature> in hex format')
    .action(async function(payload, publicKey, signature) {
        const isValid = await verifySignature(publicKey, payload, signature)
        console.log(`Signer: ${publicKey}, Payload: ${payload}, Signature: ${signature}, Result: ${isValid}`)
    })
program.version('0.0.1')
program.parse(process.argv)