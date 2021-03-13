import { Dirent } from 'fs'

const toString = Object.prototype.toString

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isStrictNull(val: any): val is undefined | null {
  return typeof val === 'undefined' || (typeof val === 'object' && val === null)
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

  objs.forEach(obj => {
    if (obj != null) {
      Object.keys(obj).forEach(key => {
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
      })
    }
  })

  return result
}
