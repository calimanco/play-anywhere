import minimist from 'minimist'
import helpPrinter from './lib/helpPrinter'
import versionPrinter from './lib/versionPrinter'
import readDistConfig from './lib/readDiskConfig'
import main from './core/main'

export default function playAnywhere(): void {
  const argv = minimist(process.argv.slice(2))
  let config = Object.create(null)
  if (argv.v === true) {
    versionPrinter()
  }
  if (argv.h === true || argv.help === true) {
    helpPrinter()
  }
  if (argv.c != null || argv.config != null) {
    config = readDistConfig(argv.c != null ? argv.c : argv.config)
  }
  if (argv.s !== true || argv.silent !== true) {
    config.slient = true
  }
  if (argv._[0] != null) {
    config.root = argv._[0]
  }
  if (argv.p != null || argv.port != null || process.env.PORT != null) {
    config.port =
      process.env.PORT != null
        ? process.env.POR
        : argv.p != null
        ? argv.p
        : argv.port
  }
  main(config)
}
