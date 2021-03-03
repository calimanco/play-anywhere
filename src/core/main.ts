import { PaConfig } from '../types'
import entryFactory from './entryFactory'
import fs from 'fs'
import defaultConfig from '../helpers/defaultConfig'

export default async function main(config: PaConfig): Promise<any> {
  const { silent, root } = config
  if (!silent) {
    console.log('Play-anywhere is running.')
  }
  let readRootDirResult = []
  try {
    readRootDirResult = fs.readdirSync(root, { withFileTypes: true })
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
  if (!silent) {
    console.log('Building entries.')
  }
  const res = await entryFactory(readRootDirResult, defaultConfig)
  if (!silent) {
    console.log(`${res.length} entries built.`)
  }
  return res
}
