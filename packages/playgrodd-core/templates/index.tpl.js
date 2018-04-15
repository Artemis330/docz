import React from 'react'
import { render } from 'react-dom'
import { App } from './app'

const _beforeRenders = [<%- BEFORE_RENDERS %>]
const _afterRenders = [<%- AFTER_RENDERS %>]

const beforeRender = () => _beforeRenders.forEach(f => f && f())
const afterRender = () => _afterRenders.forEach(f => f && f())

beforeRender()
render(<App />, document.querySelector('#root'), afterRender)
