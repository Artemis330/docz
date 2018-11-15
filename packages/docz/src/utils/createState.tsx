import * as React from 'react'
import { createContext, Component } from 'react'
import equal from 'fast-deep-equal'
import observe from 'callbag-observe'
import makeSubject from 'callbag-subject'

export interface ProviderProps<T> {
  initial?: T
}

export type PrevState<T> = (prevState: T) => T
export type GetFn<T> = (state: T) => React.ReactNode

export interface State<T> {
  get: (fn: GetFn<T>) => React.ReactNode
  set: (param: T | PrevState<T>) => void
  Provider: React.ComponentType<ProviderProps<T>>
}

export function create<T = any>(initial: T = {} as T): State<T> {
  const subject = makeSubject()
  const { Provider, Consumer } = createContext<T>(initial)

  return {
    get: fn => <Consumer>{fn}</Consumer>,
    set: fn => subject(1, fn),
    Provider: class CustomProvider extends Component<ProviderProps<T>, T> {
      public state: T = this.props.initial || initial
      public componentDidMount(): void {
        observe((v: T) => this.setState(v))(subject)
      }
      public componentWillUnmount(): void {
        subject(2)
      }
      public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        return !equal(this.state, nextState)
      }
      public render(): React.ReactNode {
        return <Provider value={this.state}>{this.props.children}</Provider>
      }
    },
  }
}
