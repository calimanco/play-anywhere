import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import getWebpackConfig from './getWebpackConfig'
const app = express()

getWebpackConfig().then(config => {
  const compiler = webpack(config)

  // app.use(express.static(publicDir))

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  )

  app.use(webpackHotMiddleware(compiler))

  const serverPort = 3000

  app.listen(serverPort, function () {
    console.log(
      `Server listening on http://localhost:${serverPort}, Ctrl+C to stop`
    )
  })
})
