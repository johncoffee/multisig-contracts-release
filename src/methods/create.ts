import { join } from 'path'
import chalk from 'chalk'
import { ok } from 'assert'
const Web3 = require('web3')
const {greenBright} = chalk

export async function create (template:string, from:string, constructorArguments:any[] = []) {
  constructorArguments.forEach(val => {
    ok(val !== undefined, "can't pass undefined to constructor")
    ok(val !== null, "can't pass null to constructor")
  })

  const web3 = new Web3('http://localhost:7545')

  const artifact = require(join(__dirname,`../../ethereum/build/contracts/${template}.json`))

  ok(artifact.bytecode && artifact.bytecode !== "0x", `Something is off with the byte code: `+ artifact.bytecode)
  const metaInstance = new web3.eth.Contract(artifact.abi)

  const deployed = await metaInstance
    .deploy({
      data: artifact.bytecode,
      arguments: constructorArguments,
    })
    .send({
      from: from,
      gas: 2000000,
    })

  console.info(`  deployed ${greenBright(template)} to ${greenBright(deployed.options.address)}`)
  return deployed
}

