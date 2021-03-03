import fs, { Dirent } from 'fs'
import { Entry, PaConfig } from '../types'
import path from 'path'
import { matchFile } from '../helpers/utils'
import * as colors from 'colors'

export default async function entryFactory(
  list: Dirent[],
  config: PaConfig
): Promise<Entry[]> {
  const { debug, pageTemplate, exclude } = config
  const entryList: Entry[] = []
  const subFolderList: string[] = []
  list.forEach(i => {
    const entry = path.join(config.root, i.name)
    const { dir, name, ext, base } = path.parse(entry)
    // exclude
    if (checkExclude(i, exclude)) {
      return
    }
    // simple mode
    if (i.isFile() && ext.match(/(ts|js)$/i) !== null) {
      entryList.push({
        dir,
        name,
        ext,
        base,
        pageTemplate
      })
      if (debug) {
        console.log(colors.green(`${name}`))
      }
      return
    }
    // complete mode
    if (i.isDirectory()) {
      subFolderList.push(i.name)
    }
  })
  if (subFolderList.length === 0) {
    return entryList
  }
  const scanSubFolderRes = await scanSubFolder(config, subFolderList)
  return entryList.concat(scanSubFolderRes)
}

async function scanSubFolder(
  config: PaConfig,
  subFolderList: string[]
): Promise<Entry[]> {
  const {
    root,
    silent,
    debug,
    entryMatch,
    templateMatch,
    exclude,
    pageTemplate
  } = config
  const length = subFolderList.length
  const result: Entry[] = []
  const resultMsg: string[] = []
  const errMsg: string[] = []
  let count = 0

  await new Promise<void>(resolve => {
    subFolderList.forEach(subFolder => {
      const subFolderPath = path.join(root, subFolder)
      fs.promises
        .readdir(subFolderPath, { withFileTypes: true })
        .then(fileList => {
          count += 1
          const entry = buildEntry(
            subFolderPath,
            entryMatch,
            templateMatch,
            pageTemplate,
            fileList.filter(i => i.isFile() && !checkExclude(i, exclude))
          )
          if (entry !== null) {
            result.push(entry)
            resultMsg.push(`${subFolder} built`)
          }
          if (length === count) {
            resolve()
          }
        })
        .catch(err => {
          count += 1
          errMsg.push(err.message)
          if (length === count) {
            resolve()
          }
        })
    })
  })

  if (!silent && debug && resultMsg.length !== 0) {
    console.log(colors.green(resultMsg.join('\n')))
  }

  if (!silent && errMsg.length !== 0) {
    console.group(
      colors.underline.red('Some errors occurred building entries: ')
    )
    console.log(colors.reset(errMsg.join('\n')))
    console.groupEnd()
  }

  return result
}

function buildEntry(
  dirPath: string,
  entryMatch: Array<RegExp | string>,
  templateMatch: Array<RegExp | string>,
  pageTemplate: string,
  fileList: Dirent[]
): Entry | null {
  let entryFilePath = ''
  let templateFilePath = ''
  entryMatch.some(reg => {
    const fileName = matchFile(fileList, reg)
    if (fileName !== '') {
      entryFilePath = path.join(dirPath, fileName)
      return true
    }
    return false
  })
  templateMatch.some(reg => {
    const fileName = matchFile(fileList, reg)
    if (fileName !== '') {
      templateFilePath = path.join(dirPath, fileName)
      return true
    }
    return false
  })
  if (entryFilePath === '') {
    return null
  } else {
    const { dir, name, base, ext } = path.parse(entryFilePath)
    return {
      name,
      base,
      ext,
      dir,
      pageTemplate: templateFilePath === '' ? pageTemplate : templateFilePath
    }
  }
}

function checkExclude(file: Dirent, exclude: Array<RegExp | string>): boolean {
  return exclude.some(reg => {
    return file.name.search(reg) !== -1
  })
}
