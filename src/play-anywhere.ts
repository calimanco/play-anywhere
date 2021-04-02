import { Server } from 'http'
import { IPaConfig } from './types'
import { resolve } from 'path'
import minimist from 'minimist'
import helpPrinter from './lib/helpPrinter'
import versionPrinter from './lib/versionPrinter'
import readDistConfig from './lib/readDiskConfig'
import main from './core/main'

export default async function playAnywhere(): Promise<Server> {
  const argv = minimist(process.argv.slice(2))
  let config: IPaConfig = {}
  if (argv.v === true || argv.version === true) {
    versionPrinter()
  }
  if (argv.h === true || argv.help === true) {
    helpPrinter()
  }
  if (argv.c != null || argv.config != null) {
    config = readDistConfig(
      argv.config != null ? resolve(argv.config) : resolve(argv.c)
    )
  }
  if (argv.s === true || argv.silent === true) {
    config.silent = true
  }
  if (argv._[0] != null) {
    config.root = resolve(argv._[0])
  }
  if (argv.p != null || argv.port != null || process.env.PORT != null) {
    config.serverPort =
      argv.port != null ? argv.port : argv.p != null ? argv.p : process.env.PORT
  }
  if (argv['static-dir'] != null) {
    config.staticDir = resolve(argv['static-dir'])
  }
  return await main(config)
}
