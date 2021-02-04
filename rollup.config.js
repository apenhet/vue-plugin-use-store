import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import generateDeclarations from 'rollup-plugin-generate-declarations';
import {readFileSync} from 'fs';
import { terser } from 'rollup-plugin-terser';

const esbrowserslist = readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

  const pkgName = 'VuePluginUseStore'

const external = [
  'vue',
];

const globals = {
  vue: 'Vue',
};

const babelConfig =  {
  exclude: 'node_modules/**',
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
  babelHelpers: 'bundled',
}

const baseConfig = {
  input: 'src/index.ts'
};

const esConfig = {
  ...baseConfig,
  external,
  output: {
    file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named',
  },
  plugins: [
    generateDeclarations(),
    babel({
      ...babelConfig,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: esbrowserslist,
          },
        ],
      ],
    }),
    commonjs(),
  ]
}

const umdConfig = {
  ...baseConfig,
  external,
  output: {
    compact: true,
    file: 'dist/index.ssr.js',
    format: 'cjs',
    name: pkgName,
    exports: 'auto',
    globals,
  },
  plugins: [
    babel(babelConfig),
    commonjs(),
  ],
};

const unpkgConfig = {
  ...baseConfig,
  external,
  output: {
    compact: true,
    file: 'dist/index.min.js',
    format: 'iife',
    name: pkgName,
    exports: 'auto',
    globals,
  },
  plugins: [
    babel(babelConfig),
    commonjs(),
    terser({
      output: {
        ecma: 5,
      },
    }),
  ],
};

export default [esConfig, umdConfig, unpkgConfig];
