import { IPaConfig } from '../declarations'
import colors from 'chalk'

export default function readDistConfig(dir: string): {} | IPaConfig {
  let result: any = {}
  try {
    result = require(dir)
  } catch (err) {
    console.log(colors.red(err.message))
    process.exit(0)
  }
  if (result == null) {
    console.log(colors.yellow('Configuration file is empty.'))
    return result
  }
  return result
}
