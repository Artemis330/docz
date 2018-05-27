import * as path from 'path'
import * as fs from 'fs'
import { test, mkdir } from 'shelljs'
import { compile } from 'art-template'

import { format } from './format'

export const mkd = (dir: string): void => {
  !test('-d', dir) && mkdir('-p', dir)
}

export const touch = (file: string, raw: string) =>
  new Promise(async (resolve, reject) => {
    const content = /jsx?$/.test(path.extname(file)) ? await format(raw) : raw
    const stream = fs.createWriteStream(file)

    stream.write(content, 'utf-8')
    stream.on('finish', () => resolve())
    stream.on('error', err => reject(err))
    stream.end()
  })

export const read = (file: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    let data = ''
    const stream = fs.createReadStream(file, { encoding: 'utf-8' })

    stream.on('data', chunk => (data += chunk))
    stream.on('end', () => resolve(data))
    stream.on('error', err => reject(err))
  })

export const readIfExist = async (file: string): Promise<string | null> => {
  if (!test('-f', file)) return Promise.resolve(null)
  return read(file)
}

export const compiled = async (file: string): Promise<(args: any) => string> =>
  read(file)
    .then(data => compile(data))
    .catch(err => err)
