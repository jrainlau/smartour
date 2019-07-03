import typescript from 'rollup-plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: './src/smartour.ts',
  output: {
    file: './dist/index.js',
    name: 'Smartour',
    format: 'umd'
  },
  plugins: [
    typescript(),
    serve(),      // index.html should be in root of project
    livereload()
  ]
}
