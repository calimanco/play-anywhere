import { IPaEntry, IPaConfig } from '../types'
import fs, { Dirent } from 'fs'
import path from 'path'
import colors from 'colors'
import { matchFile } from '../helpers/utils'

export default async function entryFactory(
  list: Dirent[],
  config: IPaConfig
): Promise<IPaEntry[]> {
  const { root, silent, debug, pageTemplate, exclude } = config
  const entryList: IPaEntry[] = []
  const subFolderList: string[] = []
  if (pageTemplate == null) {
    if (silent == null || !silent) {
      console.log(colors.red('Can not find pageTemplate.'))
    }
    throw new Error('Can not find pageTemplate.')
  }
  list.forEach(i => {
    const entry = path.join(root as string, i.name)
    const { dir, name, ext, base } = path.parse(entry)
    // exclude
    if (exclude != null && checkExclude(i, exclude)) {
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
      if ((silent == null || !silent) && debug != null && debug) {
        console.log(`${name} built`)
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
  const scanSubFolderRes = await scanSubFolder(
    config as Required<IPaConfig>,
    subFolderList
  )
  const result = entryList.concat(scanSubFolderRes)
  if (silent == null || !silent) {
    if (result.length === 0) {
      console.log(colors.yellow(`No entries found.`))
    } else {
      console.group(
        colors.underline.white(`${result.length} entries have been created: `)
      )
      console.log(colors.green(result.map(i => i.name).join('\n')))
      console.groupEnd()
    }
  }
  return result
}

async function scanSubFolder(
  config: Required<IPaConfig>,
  subFolderList: string[]
): Promise<IPaEntry[]> {
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
  const entryList: IPaEntry[] = []
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
            subFolder,
            subFolderPath,
            entryMatch,
            templateMatch,
            pageTemplate,
            fileList.filter(i => i.isFile() && !checkExclude(i, exclude))
          )
          if (!silent && debug && entry !== null) {
            console.log(`${entry.name} built`)
          }
          if (entry !== null) {
            entryList.push(entry)
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

  if (!silent && errMsg.length !== 0) {
    console.group(
      colors.underline.red(
        `${errMsg.length} errors occurred building entries: `
      )
    )
    console.log(colors.reset(errMsg.join('\n')))
    console.groupEnd()
  }

  return entryList
}

function buildEntry(
  name: string,
  dirPath: string,
  entryMatch: Array<RegExp | string>,
  templateMatch: Array<RegExp | string>,
  pageTemplate: string,
  fileList: Dirent[]
): IPaEntry | null {
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
    const { dir, base, ext } = path.parse(entryFilePath)
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
