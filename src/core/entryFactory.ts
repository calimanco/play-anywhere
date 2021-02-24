import { Dirent } from 'fs'
import path from 'path'

export default function entryFactory(list: Dirent[]): void {
  const dirArr: string[] = []
  const fileArr: string[] = []
  list.forEach(i => {
    if (i.isFile() && path.extname(i.name).match(/js|ts/i) !== null) {
      fileArr.push(i.name)
      return
    }
    if (i.isDirectory()) {
      dirArr.push(i.name)
    }
  })
  console.log(dirArr)
  console.log(fileArr)
}
