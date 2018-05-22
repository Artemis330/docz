import * as React from 'react'
import { SFC } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

import { dataContext, Entry } from '../theme'

const findEntryBySlug = (to: any) => (entry: Entry) => entry.slug === to

export const Link: SFC<NavLinkProps> = ({ to, ...props }) => (
  <dataContext.Consumer>
    {({ entries }) => {
      const entriesArr = Object.values(entries || {})
      const entry = entriesArr.find(findEntryBySlug(to))

      return entry && entries && <NavLink {...props} to={entry.route} />
    }}
  </dataContext.Consumer>
)
