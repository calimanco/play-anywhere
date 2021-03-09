import { PaConfig } from '../types'
import fs from 'fs'
import * as colors from 'colors'
import entryFactory from './entryFactory'
import generateConfig from './generateConfig'
import server from './server'
import defaultConfig from '../helpers/defaultConfig'
import mergeConfig from './mergeConfig'

export default async function main(config: PaConfig): Promise<void> {
  mergeConfig(defaultConfig, config)
  const { silent, root } = config
  if (!silent) {
    console.log(colors.cyan('Scan the folder and create entries.'))
  }
  let readRootDirResult = []
  try {
    readRootDirResult = fs.readdirSync(root, { withFileTypes: true })
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
  const entries = await entryFactory(readRootDirResult, defaultConfig)
  if (!silent) {
    console.log(colors.cyan('The server is starting.'))
  }
  server(generateConfig(config, entries))
}
