import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript'

export default {
  // input: './src/smartour.js',
  input: './source/smartour.ts',
  output: {
    file: './dist/index.js',
    name: 'Smartour',
    format: 'umd'
  },
  plugins: [
    // babel()
    typescript()
  ]
}
