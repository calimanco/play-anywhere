import path from 'path'
import { HotModuleReplacementPlugin } from 'webpack'
import { PaConfig } from '../types'

const defaultConfig: PaConfig = {
  root: path.resolve(),
  staticDir: '',
  templateDir: path.join(__dirname, '..', 'templates'),
  serverPort: 3000,
  entryRegExps: [/app\.(ts|js)$/i],
  templateRegExps: [/index\.(htm|html|ejs)$/i],
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
    stats: {
      colors: true
    },
    plugins: [new HotModuleReplacementPlugin()]
  }
}

export default defaultConfig
