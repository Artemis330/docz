import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'
import { Route } from 'react-router-dom'
import { PreviewProps, Doc, Docs } from 'playgrodd'

import { DocsContainer } from '../container'

export const Preview: SFC<PreviewProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {({ state }) => {
      const docs: Docs = Object.values(state.docs)

      return (
        docs.length > 0 &&
        docs.map((doc: Doc) => (
          <Route
            exact
            key={doc.id}
            path={doc.route}
            render={() => children(doc)}
          />
        ))
      )
    }}
  </Subscribe>
)
