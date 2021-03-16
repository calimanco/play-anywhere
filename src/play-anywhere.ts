import { PaConfig } from './types'
import path from 'path'
import minimist from 'minimist'
import helpPrinter from './lib/helpPrinter'
import versionPrinter from './lib/versionPrinter'
import readDistConfig from './lib/readDiskConfig'
import main from './core/main'

export default function playAnywhere(): void {
  const argv = minimist(process.argv.slice(2))
  let config: PaConfig = {}
  if (argv.v === true) {
    versionPrinter()
  }
  if (argv.h === true || argv.help === true) {
    helpPrinter()
  }
  if (argv.c != null || argv.config != null) {
    config = readDistConfig(argv.config != null ? argv.config : argv.c)
  }
  if (argv.s === true || argv.silent === true) {
    config.silent = true
  }
  if (argv._[0] != null) {
    config.root = path.resolve(argv._[0])
  }
  if (argv.p != null || argv.port != null || process.env.PORT != null) {
    config.serverPort =
      argv.port != null ? argv.port : argv.p != null ? argv.p : process.env.PORT
  }
  if (argv['static-dir'] != null) {
    config.staticDir = argv['static-dir']
  }
  main(config).catch(err => {
    console.log(err)
    process.exit(0)
  })
}
