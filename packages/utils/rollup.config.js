
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';

const plugins = [
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
    presets: ['@babel/preset-env'],
  }),
  commonjs(),   // must be after babel
  builtins(),
  json(),
];

export default [{
  input: 'src/index.js',
  output: {
    name: 'utils',
    file: './dist/bundle.js',
    format: 'cjs',
    globals:{},
  },
  plugins,
}, {
  input: 'src/mobx.js',
  output: {
    name: 'utils-mobx',
    file: './mobx/index.js',
    format: 'cjs',
    globals:{},
  },
  external: ['mobx'],
  plugins,
}];