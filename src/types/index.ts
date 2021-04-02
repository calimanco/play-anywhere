import { Configuration } from 'webpack'

export interface IPaEntry {
  name: string
  ext: string
  dir: string
  base: string
  pageTemplate: string
}

export interface IPaConfig {
  debug?: boolean
  silent?: boolean
  root?: string
  staticDir?: string
  serverPort?: number
  indexTemplate?: string
  pageTemplate?: string
  entryMatch?: Array<string | RegExp>
  templateMatch?: Array<string | RegExp>
  exclude?: Array<string | RegExp>
  webpackConfig?: Configuration
}
