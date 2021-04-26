import { Server } from 'http'
import { IPaConfig } from '../declarations'
import express from 'express'
import webpack from 'webpack'
import colors from 'chalk'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = express()

export default async function (config: Required<IPaConfig>): Promise<Server> {
  const {
    silent,
    webpackConfig,
    serverPort,
    staticDir,
    staticPath,
    serveStaticConfig
  } = config
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
    if (serveStaticConfig != null) {
      app.use(staticPath, express.static(staticDir, serveStaticConfig))
    } else {
      app.use(staticPath, express.static(staticDir))
    }
    if (silent == null || !silent) {
      console.log(colors.cyan(`Server mounted ${staticDir}`))
    }
  }

  return await new Promise(resolve => {
    const server = app.listen(serverPort, () => {
      if ((silent == null || !silent) && serverPort != null) {
        console.log(
          colors.cyan(
            `Server listening on http://localhost:${serverPort}, Ctrl+C to stop.\n`
          )
        )
      }
    })
    instance.waitUntilValid(() => {
      if (silent == null || !silent) {
        console.log(colors.cyan('Package is in a valid state.'))
      }
      resolve(server)
    })
  })
}
