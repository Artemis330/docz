import * as fs from 'fs'
import * as path from 'path'
import * as t from 'babel-types'
import { parse } from 'babylon'

import * as paths from './config/paths'
import { traverseAndAssign } from './utils/traverse'

export const convertToAst = (entry: string): t.File =>
  parse(fs.readFileSync(entry, 'utf-8'), {
    sourceType: 'module',
    plugins: ['jsx'],
  })

const getNameFromDoc = traverseAndAssign<any, string>(
  path => path.isCallExpression() && path.node.callee.name === 'doc',
  path => path.node.arguments[0].value
)

export class Entry {
  public name: string
  public filepath: string
  public route: string

  constructor(file: string) {
    const ast = convertToAst(file)
    const name = getNameFromDoc(ast) || ''
    const route = path.join('/', path.parse(file).dir, name)
    const filepath = path.relative(paths.ROOT, file)

    this.name = name
    this.route = route
    this.filepath = filepath
  }
}
