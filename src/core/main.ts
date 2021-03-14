import { PaConfig } from '../types'
import fs, { Dirent } from 'fs'
import * as colors from 'colors'
import entryFactory from './entryFactory'
import generateConfig from './generateConfig'
import server from './server'
import mergeConfig from './mergeConfig'
import defaultConfig from '../helpers/defaultConfig'

export default async function main(c: PaConfig): Promise<void> {
  const config = mergeConfig(defaultConfig, c)
  const { silent, root } = config
  if (silent == null || !silent) {
    console.log(colors.cyan('Scan the folder and create entries.'))
  }
  let readRootDirResult: Dirent[] = []
  try {
    if (root != null) {
      readRootDirResult = fs.readdirSync(root, { withFileTypes: true })
    }
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
  const entries = await entryFactory(readRootDirResult, config)
  if (silent == null || !silent) {
    console.log(colors.cyan('The server is starting.'))
  }
  server(generateConfig(config, entries))
}
