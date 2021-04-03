import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import { camelCase } from 'lodash'

import pkg from './package.json'

const libraryName = 'play-anywhere'

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'cjs',
      exports: 'auto',
      sourcemap: false
    },
    { file: pkg.module, format: 'es', sourcemap: false }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'minimist',
    'colors',
    'express',
    'webpack',
    'copy-webpack-plugin',
    'html-webpack-plugin',
    'webpack-dev-middleware',
    'webpack-hot-middleware',
    'webpack-merge'
  ],
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          removeComments: true,
          module: 'ES2015'
        }
      }
    }),
    // Resolve source maps to the original source
    sourceMaps()
  ]
}
