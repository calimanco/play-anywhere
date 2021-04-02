import { Server } from 'http'
import { Dirent } from 'fs'

const toString = Object.prototype.toString

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

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

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  for (const obj of objs) {
    if (obj != null) {
      for (const key of Object.keys(obj)) {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      }
    }
  }

  return result
}

export async function closeServer(server: Server): Promise<void> {
  return await new Promise((resolve, reject) => {
    server.close(err => {
      if (err != null) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
