import { IPaEntry, IPaConfig } from '../types'
import path from 'path'
import colors from 'colors'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default function generateConfig(
  config: IPaConfig,
  entries: IPaEntry[]
): Required<IPaConfig> {
  const { indexTemplate, webpackConfig, silent } = config
  if (webpackConfig == null) {
    if (silent == null || !silent) {
      console.log(colors.red('Can not find webpack config.'))
    }
    throw new Error('Can not find webpack config.')
  }
  if (silent != null && silent) {
    webpackConfig.stats = 'none'
  }
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
  return config as Required<IPaConfig>
}
