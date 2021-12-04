import esbuild from 'rollup-plugin-esbuild-transform'
import dts from 'rollup-plugin-dts'
import pkg from './package.json'

export default [
  {
    external: ['fs', 'path'],
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      esbuild([
        {
          loader: 'ts'
        },
        {
          output: true,
          target: 'node12'
        }
      ])
    ]
  },
  {
    input: '.cache/index.d.ts',
    plugins: [dts()],
    output: {
      file: pkg.types,
      format: 'es'
    }
  }
]
