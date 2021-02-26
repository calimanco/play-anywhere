import { Dirent } from 'fs'
import { Entry, PaConfig } from '../types'
import path from 'path'

export default function entryFactory(
  list: Dirent[],
  config: PaConfig
): Entry[] {
  const entryList: Entry[] = []
  const dirArr: string[] = []
  list.forEach(i => {
    // simple mode
    if (i.isFile() && path.extname(i.name).match(/js|ts/i) !== null) {
      entryList.push({
        name: i.name,
        entryFile: path.join(config.root, i.name),
        templateFile: ''
      })
      return
    }
    // complete mode
    if (i.isDirectory()) {
      dirArr.push(i.name)
    }
  })
  return []
}
