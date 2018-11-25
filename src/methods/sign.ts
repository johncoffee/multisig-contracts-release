import { createSig, retrieveKeystore, ECSignature } from '../sigTools.js'
import { join } from 'path'
import { getWeb3 } from '../web3.js'

export function sign(destMethod:string, destAddress:string, multisigAddress:string, seedPhrase:string, password:string):Promise<ECSignature> {
  const web3 = getWeb3()

  const multisigInstance = new web3.eth.Contract(require(join(__dirname, '../../ethereum/build/contracts/SimpleMultiSig')).abi,
    multisigAddress,
    {
    })

  const p = new Promise<ECSignature>(resolve => {

    multisigInstance.methods.nonce().call().then(async nonce => {
      const [ks, keyFromPw] = await retrieveKeystore(seedPhrase, password)
      ks.generateNewAddress(keyFromPw, 1)
      const [signingAddr] = ks.getAddresses()
      let s:ECSignature

      s = createSig(ks, signingAddr, keyFromPw, multisigAddress, nonce, destMethod, destAddress)
      resolve(s)
    })
  })

  return p
}