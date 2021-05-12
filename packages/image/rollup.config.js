
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg'

import { terser } from 'rollup-plugin-terser';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import builtins from 'rollup-plugin-node-builtins';
import postcss from 'rollup-plugin-postcss';

const output = {
  name: '@zhizhu/image',
  file: './dist/bundle.js',
  format: 'esm',
  globals:{},
  exports: 'default',
};

export default [{
  input: './src/index.jsx',
  output: [{
    ...output
  }],
  plugins: [
    postcss({
      modules: true,
      extensions: ['.css', '.less', '.scss'],
    }),
    alias({
      entries: [
        { find: /^@\/(.*)/, replacement: `${__dirname}/src/$1` }
      ],
    }),
    resolve({
      preferBuiltins: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    babel({
      babelrc: false,
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
      presets: [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage",
            // "debug": false,
            "corejs": 3     // core-js 的版本
          }
        ],
        [
          "@babel/preset-react"
        ]
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    svg({base64: true}),
    commonjs(),   // must be after babel
    builtins(),
    process.env.NODE_ENV === 'production' ? terser() : null,
    json(),
  ],
  external: ['react', 'redux', 'redux', 'lodash', 'styled-components'],
  
}];