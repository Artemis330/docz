import './styles'
import './styles/prism-theme'

import * as React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { theme } from 'docz'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { View } from './components/View'

export const Theme = theme(() => (
  <BrowserRouter>
    <Main>
      <Menu />
      <View />
    </Main>
  </BrowserRouter>
))
