
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

// import { terser } from 'rollup-plugin-terser';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import builtins from 'rollup-plugin-node-builtins';
import postcss from 'rollup-plugin-postcss';


export default [{
  input: 'src/components/Dashboard/index.jsx',
  output: {
    name: 'BasicLayout',
    file: './dist/bundle.js',
    format: 'esm',
    globals:{},
  },
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
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ]
    }),
    commonjs(),   // must be after babel
    builtins(),
    // process.env.NODE_ENV === 'production' ? terser() : null,
    json(),
  ],
  external: [
    'react',
    'react-router-dom',
    'antd',
    'classnames',
    'axios',
    'querystring',
    'mobx',
    'mobx-react'
  ],
}];
