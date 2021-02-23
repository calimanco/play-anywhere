import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import { camelCase } from 'lodash'
// Only use for es5 code.
import { uglify } from 'rollup-plugin-uglify'

import pkg from './package.json'

const libraryName = 'play-anywhere'

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.main.replace('.js', '.min.js'),
      name: camelCase(libraryName),
      format: 'umd',
      exports: 'named',
      sourcemap: false,
      plugins: [uglify()]
    },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
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
