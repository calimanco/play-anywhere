import { Server } from 'http'
import { Configuration } from 'webpack'
import { ServeStaticOptions } from 'serve-static'
import { Response } from 'express'

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
  staticPath?: string
  serverPort?: number
  indexTemplate?: string
  pageTemplate?: string
  entryMatch?: Array<string | RegExp>
  templateMatch?: Array<string | RegExp>
  exclude?: Array<string | RegExp>
  webpackConfig?: Configuration
  serveStaticConfig?: ServeStaticOptions<Response> | null
}

export interface IPaServer {
  origin: Server
  close: () => Promise<void>
  getConfig: () => IPaConfig
}
