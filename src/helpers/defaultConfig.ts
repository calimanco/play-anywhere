import { PaConfig } from '../types'
import path from 'path'
import { HotModuleReplacementPlugin } from 'webpack'

const templateDir = path.join(__dirname, '..', 'templates')

const defaultConfig: Required<PaConfig> = {
  debug: false,
  silent: false,
  root: path.resolve('demo'),
  staticDir: '',
  indexTemplate: path.join(templateDir, 'index.ejs'),
  pageTemplate: path.join(templateDir, 'page.ejs'),
  serverPort: 3000,
  entryMatch: [/^app\.(ts|js)$/i],
  templateMatch: [/^index\.(htm|html|ejs)$/i],
  exclude: [/^node_modules$/i, /^\./i],
  webpackConfig: {
    mode: 'development',
    context: path.join(__dirname, '..'),
    devtool: 'eval-cheap-module-source-map',
    output: {
      path: path.join(__dirname, '__build__'),
      filename: '[name]/[contenthash].js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.css?$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    stats: 'normal',
    plugins: [new HotModuleReplacementPlugin()]
  }
}

export default defaultConfig
