import { config } from 'docz-rollup'

export default config({
  outputDir: 'lib',
  input: [
    'src/ast.ts',
    'src/codesandbox.ts',
    'src/format.ts',
    'src/fs.ts',
    'src/index.ts',
    'src/imports.ts',
    'src/jsx.ts',
    'src/mdast.ts',
  ],
})
