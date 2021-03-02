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
    // simple mode
    const entry = path.join(config.root, i.name)
    const { name, ext } = path.parse(i.name)
    console.log(name, ext)
    if (
      i.isFile() &&
      !matchFile(entry, exclude) &&
      ext.match(/\.(ts|js)$/i) !== null
    ) {
      entryList.push({
        name,
        entryFile: entry,
        templateFile: pageTemplate
      })
      if (debug) {
        console.log(colors.green(`${name} built`))
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
            fileList
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
  let name = ''
  let entryFile = ''
  let templateFile = ''
  fileList.some(file => {
    if (!file.isFile()) {
      return false
    }
    const filePath = path.join(dirPath, file.name)
    if (entryFile === '' && matchFile(filePath, entryMatch)) {
      name = file.name
      entryFile = filePath
    }
    if (templateFile === '' && matchFile(filePath, templateMatch)) {
      templateFile = filePath
    }
    return entryFile !== '' && templateFile !== ''
  })
  return entryFile === ''
    ? null
    : {
        name,
        entryFile,
        templateFile: templateFile === '' ? pageTemplate : templateFile
      }
}
