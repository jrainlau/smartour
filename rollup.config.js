import typescript from 'rollup-plugin-typescript'

export default {
  input: './src/smartour.ts',
  output: [{
    file: './dist/index.js',
    name: 'Smartour',
    format: 'umd'
  }, {
    file: './dist/index.esm.js',
    format: 'es'
  }],
  plugins: [
    typescript()
  ]
}
