import { PaConfig } from '../types'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = express()

export default function (config: PaConfig): void {
  const { webpackConfig } = config
  const compiler = webpack(webpackConfig)

  // app.use(express.static(publicDir))

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath:
        webpackConfig.output !== undefined
          ? (webpackConfig.output.publicPath as string)
          : '/'
    })
  )

  app.use(webpackHotMiddleware(compiler))

  const serverPort = 3000

  app.listen(serverPort, function () {
    console.log(
      `Server listening on http://localhost:${serverPort}, Ctrl+C to stop`
    )
  })
}
