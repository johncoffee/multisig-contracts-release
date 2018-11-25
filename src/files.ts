import { extname, join } from 'path'
import { Item, Options } from 'klaw'
import * as klaw from 'klaw'
import { ensureDir, ensureFile, readJSON, writeJSON } from 'fs-extra'

const opts = <Options>{
  filter: filePath => extname(filePath) === ".json",
}

const dataDirPath = join(__dirname, '../data')
const filePath = join(dataDirPath, '/deployed.json')
const contractsPath = join(__dirname, "../ethereum/build/contracts/")

type json = {[k :string]: json[]|json|string|number|boolean|null}
type jsonList = json[]

export async function getContractArtifacts():Promise<json[]> {
  return new Promise<json[]>(resolve => {
    const reads = <Promise<any>[]>[]

    klaw(contractsPath, opts)
      .on('data', item => {
        if (!item.stats.isDirectory()) {
          reads.push( readJSON(item.path) )
        }
      })
      .on('end', async () => {
        const items:jsonList = await Promise.all(reads)
        const filtered = items
          .filter(artf => artf.contractName !== 'Migrations')   // filter out Truffle migration tracking
          .filter(artf => artf.bytecode !== '0x')   // filter out interfaces

        resolve(filtered)
      })
  })
}

export type savedContract = {
  address: string
  contractName: string
  created: string
  created_note: string
}

export async function addDeployedContract (name:string, address: string, msg?:string) {
  const table = await getDeployedContracts2()
  table.push(<savedContract>{
    address: address,
    contractName: name,
    created: new Date().toJSON(),
    created_note: msg,
  })
  await writeJSON(filePath,table,{
    spaces: 2 // JSON formatting
  })
}


export async function getDeployedContracts2 ():Promise<savedContract[]> {
  try {
    await ensureDir(dataDirPath)
    await ensureFile(filePath)
    const map = await readJSON(filePath)
    if (Array.isArray(map)) {
      return map
    }
    else if (map && typeof map === "object") {
      return Object.values(map)
    }
  }
  catch (e) {
  }
  return []
}