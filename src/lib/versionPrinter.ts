import { isStrictNull } from '../helpers/utils'

export default function versionPrinter(): void {
  console.log(
    `v${!isStrictNull(process.env.version) ? process.env.version : 'unknown'}`
  )
  process.exit(1)
}
