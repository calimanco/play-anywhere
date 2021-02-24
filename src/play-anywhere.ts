import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import helpPrinter from './lib/helpPrinter'
import versionPrinter from './lib/versionPrinter'
import entryFactory from './core/entryFactory'

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
  const root = path.resolve(typeof argv._[0] === 'string' ? argv._[0] : '')
  try {
    fs.accessSync(root, fs.constants.R_OK)
  } catch (err) {
    console.error('no access!')
    process.exit(0)
  }
  entryFactory(fs.readdirSync(root, { withFileTypes: true }))
}
