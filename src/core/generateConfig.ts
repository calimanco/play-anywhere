import { PaEntry, PaConfig } from '../types'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default function generateConfig(
  config: PaConfig,
  entries: PaEntry[]
): PaConfig {
  const { indexTemplate, webpackConfig } = config
  webpackConfig.entry = entries.reduce((result: any, i) => {
    result[i.name] = {
      import: path.join(i.dir, i.base)
    }
    return result
  }, {})
  const htmlPlugins = [
    new HtmlWebpackPlugin({
      chunks: [],
      template: indexTemplate,
      templateParameters: { entries }
    })
  ].concat(
    entries.map(i => {
      return new HtmlWebpackPlugin({
        title: i.name,
        filename: path.join(i.name, 'index.html'),
        chunks: [i.name],
        template: i.pageTemplate
      })
    })
  )
  webpackConfig.plugins =
    webpackConfig.plugins !== undefined
      ? webpackConfig.plugins.concat(htmlPlugins)
      : htmlPlugins
  return config
}
