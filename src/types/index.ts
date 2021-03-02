import { Configuration } from 'webpack'

export interface Entry {
  name: string
  entryFile: string
  templateFile: string
}

export interface PaConfig {
  debug: boolean
  silent: boolean
  root: string
  staticDir: string
  serverPort: number
  indexTemplate: string
  pageTemplate: string
  entryMatch: Array<string | RegExp>
  templateMatch: Array<string | RegExp>
  exclude: Array<string | RegExp>
  webpackConfig: Configuration
}
