/* eslint-disable */
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import inject from 'rollup-plugin-inject'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const processShim = '\0process-shim'

const prod = process.env.PRODUCTION
const env = prod ? 'production' : 'development'

console.log(`Creating ${env} bundle...`)

const targets = prod ?
  [
    { dest: 'dist/hedron.min.js', format: 'cjs' },
  ] :
  [
    { dest: 'dist/hedron.js', format: 'cjs' },
    { dest: 'dist/hedron.es.js', format: 'es' },
  ]

const plugins = [
  nodeResolve({
    module: false,
    jsnext: false,
    main: true,
  }),
  commonjs(),
  {
    resolveId(importee) {
      if (importee === processShim) return importee
      return null
    },
    load(id) {
      if (id === processShim) return 'export default { argv: [], env: {} }'
      return null
    },
  },
  babel({
    babelrc: false,
    presets: [
      [
        'env',
        {
          modules: false,
          targets: {
            browsers: ['last 2 versions', '> 5%'],
          },
        },
      ],
      'stage-0',
      'react',
    ],
    plugins: [
      'flow-react-proptypes',
      'styled-components',
    ],
  }),
  inject({
    process: processShim,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development'),
  }),
]

if (prod) plugins.push(uglify())

export default {
  entry: 'src/index.js',
  external: ['react', 'styled-components'],
  plugins,
  targets,
}
