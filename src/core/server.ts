import { PaConfig } from '../types'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = express()

export default function (config: Required<PaConfig>): void {
  const { silent, webpackConfig, serverPort, staticDir } = config
  const compiler = webpack(webpackConfig)

  if (staticDir != null && staticDir !== '') {
    app.use(express.static(staticDir))
  }

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath:
        webpackConfig.output != null
          ? (webpackConfig.output.publicPath as string)
          : '/'
    })
  )

  app.use(webpackHotMiddleware(compiler))

  app.listen(serverPort, () => {
    if ((silent == null || !silent) && serverPort != null) {
      console.log(
        `Server listening on http://localhost:${serverPort}, Ctrl+C to stop`
      )
    }
  })
}
