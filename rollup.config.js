export default {
  input: './src/smartour.js',
  output: [{
    file: './dist/index.js',
    name: 'Smartour',
    format: 'umd'
  }, {
    file: './dist/index.esm.js',
    format: 'es'
  }]
}
