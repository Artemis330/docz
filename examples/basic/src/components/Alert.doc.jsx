import React, { Fragment } from 'react'
import { doc } from 'docz'

import { Alert } from './Alert'
import { components } from './'

doc('Alert')
  .group(components)
  .description('This component is used to show alerts')
  .section('Basic usage', () => <Alert>Some message</Alert>)
  .section('Using different kinds', () => (
    <Fragment>
      <Alert>Some message</Alert>
      <Alert kind="positive">Some message</Alert>
      <Alert kind="negative">Some message</Alert>
      <Alert kind="warning">Some message</Alert>
    </Fragment>
  ))
