import { Server } from 'http'
import { IPaConfig } from '../declarations'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = express()

export default async function (config: Required<IPaConfig>): Promise<Server> {
  const { silent, webpackConfig, serverPort, staticDir } = config
  const compiler = webpack(webpackConfig)
  const instance = webpackDevMiddleware(compiler, {
    publicPath:
      webpackConfig.output != null
        ? (webpackConfig.output.publicPath as string)
        : '/'
  })

  app.use(instance)

  app.use(webpackHotMiddleware(compiler))

  if (staticDir != null && staticDir !== '') {
    app.use(express.static(staticDir))
    if (silent == null || !silent) {
      console.log(`Server mounted ${staticDir}`)
    }
  }

  return await new Promise(resolve => {
    const server = app.listen(serverPort, () => {
      if ((silent == null || !silent) && serverPort != null) {
        console.log(
          `Server listening on http://localhost:${serverPort}, Ctrl+C to stop.`
        )
      }
    })
    instance.waitUntilValid(() => {
      console.log('Package is in a valid state.')
      resolve(server)
    })
  })
}
