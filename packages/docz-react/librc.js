const copy = require('rollup-plugin-cpy')

module.exports = {
  plugins: [
    copy([
      {
        files: 'templates/*.{js,html,json}',
        dest: 'dist/templates',
      },
      {
        files: 'index.d.ts',
        dest: 'dist',
      },
    ]),
  ],
}
