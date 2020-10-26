
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

// import { terser } from 'rollup-plugin-terser';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import builtins from 'rollup-plugin-node-builtins';
import postcss from 'rollup-plugin-postcss';


export default [{
  input: 'src/main.js',
  output: {
    name: 'ColorLog',
    file: './dist/color-log.js',
    format: 'cjs',
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
    getBabelOutputPlugin({
      presets: ['@babel/preset-env']
    }),
    babel({
      babelrc: false,
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),   // must be after babel
    builtins(),
    // process.env.NODE_ENV === 'production' ? terser() : null,
    json(),
  ],
  external: ['react', 'antd'],
}];