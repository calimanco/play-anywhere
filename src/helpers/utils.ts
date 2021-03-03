import { Dirent } from 'fs'

export function matchFile(fileList: Dirent[], reg: RegExp | string): string {
  let result: string = ''
  fileList.some(file => {
    if (file.name.search(reg) !== -1) {
      result = file.name
      return true
    }
    return false
  })
  return result
}
