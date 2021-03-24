import { PaConfig } from '../types'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = express()

export default async function (config: Required<PaConfig>): Promise<string> {
  const { silent, webpackConfig, serverPort, staticDir } = config
  const compiler = webpack(webpackConfig)

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath:
        webpackConfig.output != null
          ? (webpackConfig.output.publicPath as string)
          : '/'
    })
  )

  app.use(webpackHotMiddleware(compiler))

  if (staticDir != null && staticDir !== '') {
    app.use(express.static(staticDir))
    if (silent == null || !silent) {
      console.log(`Server mounted ${staticDir}`)
    }
  }

  return await new Promise(resolve => {
    app.listen(serverPort, () => {
      if ((silent == null || !silent) && serverPort != null) {
        console.log(
          `Server listening on http://localhost:${serverPort}, Ctrl+C to stop`
        )
      }
      resolve('Server ready')
    })
  })
}