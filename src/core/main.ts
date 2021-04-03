import { IPaConfig, IPaServer } from '../declarations'
import fs from 'fs'
import colors from 'colors'
import entryFactory from './entryFactory'
import generateConfig from './generateConfig'
import server from './server'
import mergeConfig from './mergeConfig'
import getDefaultConfig from '../helpers/defaultConfig'
import { closeServer } from '../helpers/utils'

export default async function main(c: IPaConfig): Promise<IPaServer> {
  const config = mergeConfig(getDefaultConfig(), c)
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
  const originServer = await server(finalConfig)
  return {
    origin: originServer,
    close: async () => await closeServer(originServer),
    getConfig: () => finalConfig
  }
}
