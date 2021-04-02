import playAnywhere from './play-anywhere'
import { name, version } from '../package.json'
import { join } from 'path'

process.title = name
process.env.version = version
process.env.templateDir = join(__dirname, '..', 'templates')

// export main
export default playAnywhere
