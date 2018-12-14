import { SFC, ComponentType } from 'react'
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'

const BaseButton = styled('button')`
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;
  border: none;
`

interface ButtonProps {
  as?: ComponentType | string
}

export const Button: SFC<ButtonProps> = ({
  as: Component = BaseButton,
  ...props
}) => <Component {...props} />

export const ButtonLink = styled(Button as any)`
  background: transparent;
`
