import * as fs from 'fs'
import * as path from 'path'

export type Paths = {
  ROOT: string
  PLAYGRODD: string
  PACKAGE_JSON: string

  APP_JS: string
  INDEX_JS: string
  INDEX_HTML: string
  DIST: string

  TEMPLATES_PATH: string
}

export const ROOT = fs.realpathSync(process.cwd())
export const PLAYGRODD = path.join(ROOT, '.playgrodd')
export const PACKAGE_JSON = path.join(ROOT, 'package.json')

export const APP_JS = path.join(PLAYGRODD, 'app.jsx')
export const INDEX_JS = path.join(PLAYGRODD, 'index.jsx')
export const INDEX_HTML = path.join(PLAYGRODD, 'index.html')
export const DIST = path.join(PLAYGRODD, 'dist')

export const TEMPLATES_PATH = path.join(__dirname, '../../templates')
