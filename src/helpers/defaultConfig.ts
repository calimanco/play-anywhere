import { IPaConfig } from '../declarations'
import path from 'path'
import { HotModuleReplacementPlugin } from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'

function getDefaultConfig(): Required<IPaConfig> {
  const templateDir = process.env.templateDir as string
  return {
    debug: false,
    silent: false,
    root: path.resolve(),
    staticDir: '',
    staticPath: '/public',
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
      stats: {
        colors: true
      },
      plugins: [
        new CopyPlugin({
          patterns: [
            { from: path.join(templateDir, 'global.css'), to: 'global.css' }
          ]
        }),
        new HotModuleReplacementPlugin()
      ]
    },
    serveStaticConfig: null
  }
}

export default getDefaultConfig
