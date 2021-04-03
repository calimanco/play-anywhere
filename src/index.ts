import playAnywhere from './play-anywhere'
import { join } from 'path'
import { readFileSync } from 'fs'

const jsonPackage = join(__dirname, '..', 'package.json')
const pkg = JSON.parse(readFileSync(jsonPackage).toString())

process.title = pkg.name
process.env.version = pkg.version
process.env.templateDir = join(__dirname, '..', 'templates')

// export types
export * from './declarations'

// export main
export default playAnywhere
