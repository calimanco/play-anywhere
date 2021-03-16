import { PaConfig } from '../types'
import fs from 'fs'
import * as colors from 'colors'
import entryFactory from './entryFactory'
import generateConfig from './generateConfig'
import server from './server'
import mergeConfig from './mergeConfig'
import defaultConfig from '../helpers/defaultConfig'

export default async function main(c: PaConfig): Promise<void> {
  const config = mergeConfig(defaultConfig, c)
  const { silent, root, debug } = config
  if (silent == null || !silent) {
    console.log(colors.cyan('Scan the folder and create entries.'))
  }
  if (root == null) {
    if (silent == null || !silent) {
      console.log(colors.red('Can not find root.'))
    }
    throw new Error('Can not find root.')
  }
  const readRootDirResult = fs.readdirSync(root, { withFileTypes: true })
  const entries = await entryFactory(readRootDirResult, config)
  if (silent == null || !silent) {
    console.log(colors.cyan('The server is starting.'))
  }
  const finalConfig = generateConfig(config, entries)
  if ((silent == null || !silent) && debug != null && debug) {
    console.log(finalConfig)
  }
  server(finalConfig)
}
