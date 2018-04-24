/* tslint:disable:variable-name */
import { ulid } from 'ulid'
import slugify from '@sindresorhus/slugify'

import { isFn, safeUrl } from './utils/helpers'

export interface Section {
  id: string
  title?: string
  code?: string
  render: (container: HTMLElement) => any
}

export interface DocConstructorArgs {
  name: string
}

export interface DocObj {
  readonly name: string
  readonly route: string
  readonly id: string | undefined
  readonly order: number
  readonly description: string | undefined
  readonly filepath: string | undefined
  readonly category: string | undefined
  readonly sections: Section[]
}

export interface Entry {
  id: string
  name: string
  filepath: string
  importPath: string
  sections: string[]
}

export type RenderFn = (child: any, container: HTMLElement) => void

export class Doc {
  private _name: string
  private _route: string
  private _id: string | undefined
  private _order: number
  private _description: string | undefined
  private _filepath: string | undefined
  private _category: string | undefined
  private _sections: Section[]
  private _render: RenderFn

  constructor(name: string, render: RenderFn) {
    this._name = name
    this._sections = []
    this._route = `/${slugify(name)}`
    this._order = 0
    this._render = render

    return this
  }

  public category(category: string): Doc {
    this._category = category
    this._route = `/${slugify(category)}` + this._route

    return this
  }

  public order(num: number): Doc {
    this._order = num
    return this
  }

  public description(value: string): Doc {
    this._description = value
    return this
  }

  public section(...args: any[]): Doc {
    const [title, renderMethod] = args
    const render = isFn(title) ? title : renderMethod
    const id = ulid()

    this._sections.push({
      id,
      render: (container: HTMLElement) => this._render(render, container),
      ...(title && !isFn(title) && { title }),
    })

    return this
  }

  public route(path: string): Doc {
    this._route = safeUrl(path)
    return this
  }

  public findEntryAndMerge(entries: Entry[]): Doc {
    const entry = entries.find(entry => entry.name === this._name)

    if (entry) {
      this._id = entry.id
      this._filepath = entry.filepath
      this._sections.forEach((section, id) => {
        section.code = entry.sections[id]
      })
    }

    return this
  }

  public toObject(): DocObj {
    return {
      id: this._id,
      name: this._name,
      order: this._order,
      category: this._category,
      description: this._description,
      filepath: this._filepath,
      route: this._route,
      sections: this._sections,
    }
  }
}
