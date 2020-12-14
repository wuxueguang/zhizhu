
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

import { terser } from 'rollup-plugin-terser';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import builtins from 'rollup-plugin-node-builtins';
import postcss from 'rollup-plugin-postcss';

const output = {
  name: 'ColorLog',
  file: './dist/bundle.js',
  format: 'cjs',
  globals:{},
  exports: 'default',
};

export default [{
  input: ['src/main.js'],
  output: [{
    ...output
  }, {
    ...output,
    plugins: [
      terser(),
    ],
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
      presets: ['@babel/preset-env'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),   // must be after babel
    builtins(),
    // process.env.NODE_ENV === 'production' ? terser() : null,
    json(),
  ],
  external: ['react', 'antd'],
  
}];