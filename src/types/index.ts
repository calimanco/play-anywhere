import { Configuration } from 'webpack'

export interface Entry {
  name: string
  entryFile: string
  templateFile: string
}

export interface PaConfig {
  root: string
  staticDir: string
  templateDir: string
  serverPort: number
  entryRegExps: RegExp[]
  templateRegExps: RegExp[]
  webpackConfig: Configuration
}
