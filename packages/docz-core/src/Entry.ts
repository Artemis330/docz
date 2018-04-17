import * as fs from 'fs'
import * as path from 'path'
import * as t from 'babel-types'
import { NodePath } from 'babel-traverse'
import { File } from 'babel-types'
import { parse } from 'babylon'

import * as paths from './config/paths'
import { traverseAndAssign } from './utils/traverse'

const convertToAst = (entry: string): File | null => {
  try {
    return parse(fs.readFileSync(entry, 'utf-8'), {
      plugins: ['jsx'],
      sourceType: 'module',
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

const getNameFromDoc = traverseAndAssign<any, string>({
  assign: p => p.node.arguments[0].value,
  when: p => p.isCallExpression() && p.node.callee.name === 'doc',
})

const hasImport = (filepath: NodePath<any>): boolean =>
  filepath.isImportDeclaration() &&
  filepath.node &&
  filepath.node.source &&
  filepath.node.source.value === 'docz'

const hasDocFn = (filepath: NodePath<any>): boolean =>
  filepath.node.specifiers &&
  filepath.node.specifiers.some(
    (node: NodePath<any>) =>
      t.isImportSpecifier(node) && node.imported.name === 'doc'
  )

const checkImport = traverseAndAssign<NodePath<t.Node>, boolean>({
  assign: () => true,
  when: p => hasImport(p) && hasDocFn(p),
})

export interface EntryConstructor {
  file: string
  src: string
}

export class Entry {
  public static parseName(file: string): string | undefined | null {
    const ast = convertToAst(file)
    return ast && getNameFromDoc(ast)
  }

  public static check(entry: string): boolean | undefined | null {
    const ast = convertToAst(entry)
    return ast && checkImport(ast)
  }

  public name: string | undefined
  public filepath: string

  constructor({ src, file }: EntryConstructor) {
    const ast = convertToAst(file)
    const name = ast ? getNameFromDoc(ast) : ''
    const filepath = path.relative(paths.root, file)

    this.name = name
    this.filepath = filepath
  }
}
