import * as React from 'react'
import { Doc, DocObj, Entry } from 'docz/doc'
import { isFn } from 'docz/utils'

export interface DocsRenderProps {
  docs: DocObj[]
  categories: string[]
}

export interface DocsProps {
  children: (renderProps: DocsRenderProps) => React.ReactNode
}

export const cache = new Map()
export const entriesContext = React.createContext([] as Entry[])

const mergeDocsWithEntries = (docs: Doc[], entries: Entry[]): DocObj[] =>
  docs
    .map(doc => doc.findEntryAndMerge(entries))
    .map(doc => doc.toObject())
    .sort((docA, docB) => docB.order - docA.order)

const categoriesFromDocs = (docs: Doc[]) =>
  docs.reduce((arr: string[], docInstance: Doc) => {
    const { category } = docInstance.toObject()
    return category && arr.indexOf(category) === -1
      ? arr.concat([category])
      : arr
  }, [])

export const Docs: React.SFC<DocsProps> = ({ children }) => (
  <entriesContext.Consumer>
    {entries => {
      const docs = Array.from(cache.values())

      return (
        isFn(children) &&
        children({
          docs: mergeDocsWithEntries(docs, entries),
          categories: categoriesFromDocs(docs),
        })
      )
    }}
  </entriesContext.Consumer>
)
