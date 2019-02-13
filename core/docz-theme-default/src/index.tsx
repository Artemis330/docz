import * as React from 'react'
import { SFC } from 'react'
import { theme, DocPreview } from 'docz'
import get from 'lodash.get'
import webfont from 'webfontloader'

import * as components from './components/ui'
import * as modes from './styles/modes'
import { Global } from './styles/global'
import { config } from './config'
import { ThemeProvider } from './utils/theme'

const componentsMap = {
  a: components.Link,
  blockquote: components.Blockquote,
  h1: components.H1,
  h2: components.H2,
  h3: components.H3,
  h4: components.H4,
  h5: components.H5,
  h6: components.H6,
  hr: components.Hr,
  inlineCode: components.InlineCode,
  loading: components.Loading,
  notFound: components.NotFound,
  ol: components.OrderedList,
  p: components.Paragraph,
  page: components.Page,
  pre: components.Pre,
  table: components.Table,
  ul: components.UnorderedList,
}

const Theme: SFC = ({ children }) => {
  return (
    <ThemeProvider>
      <Global />
      <DocPreview components={componentsMap}>
        {typeof children === 'function' ? children(componentsMap) : children}
      </DocPreview>
    </ThemeProvider>
  )
}

webfont.load({
  google: {
    families: [
      'Source Code Pro',
      'Source Sans Pro:400,600',
      'Poppins:400',
      'Playfair Display:700',
    ],
  },
})

const enhance = theme(config, ({ mode, codemirrorTheme, ...config }) => ({
  ...config,
  mode,
  codemirrorTheme: codemirrorTheme || `docz-${mode}`,
  colors: {
    ...get(modes, mode),
    ...config.colors,
  },
}))

export default enhance(Theme)
