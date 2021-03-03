import minimist from 'minimist'
import helpPrinter from './lib/helpPrinter'
import versionPrinter from './lib/versionPrinter'
import main from './core/main'
import defaultConfig from './helpers/defaultConfig'

export default function playAnywhere(): void {
  const argv = minimist(process.argv.slice(2))
  if (argv.v === true) {
    versionPrinter()
  }
  if (argv.h === true || argv.help === true) {
    helpPrinter()
  }
  // if (
  //   typeof argv.p === 'number' ||
  //   typeof argv.port === 'number' ||
  //   process.env.PORT != null
  // ) {
  //   config.port = argv.p || argv.port || process.env.PORT
  // }
  main(defaultConfig)
}
