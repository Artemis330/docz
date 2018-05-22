import { load } from 'load-cfg'
import chokidar from 'chokidar'
import WebSocket from 'ws'

import * as paths from '../config/paths'
import { Config } from './args'

import { Entries, EntryMap } from '../Entries'
import { webpack } from '../bundlers'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const entriesData = (entries: EntryMap, config: Config) =>
  JSON.stringify({
    type: 'entries data',
    data: {
      entries,
      title: config.title,
      description: config.description,
    },
  })

const updateEntries = (socket: WebSocket) => (config: Config) => async () => {
  const newEntries = new Entries(config)
  const newMap = await newEntries.getMap()

  await Entries.rewrite(newMap)
  socket.send(entriesData(newMap, config))
}

const processEntries = (config: Config) => async (server: any) => {
  const entries = new Entries(config)
  const map = await entries.getMap()
  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  const wss = new WebSocket.Server({
    server,
    host: config.websocketHost,
    port: config.websocketPort,
  })

  const handleClose = () => {
    watcher.close()
    wss.close()
  }

  const handleConnection = async (socket: WebSocket) => {
    const update = updateEntries(socket)

    socket.send(entriesData(map, config))

    watcher.on('change', update(config))
    watcher.on('unlink', update(config))
    watcher.on('raw', (event: string, path: string, details: any) => {
      if (details.event === 'moved' && details.type === 'directory') {
        update(config)()
      }
    })
  }

  wss.on('connection', handleConnection)
  server.on('close', handleClose)
  process.on('exit', handleClose)
  process.on('SIGINT', handleClose)

  await Entries.write(config, map)
}

const INITIAL_CONFIG = {
  paths,
  plugins: [],
  mdPlugins: [],
  hastPlugins: [],
}

export const dev = async (args: Config) => {
  const config = load('docz', { ...args, ...INITIAL_CONFIG })
  const bundler = webpack(config)
  const server = await bundler.createServer(bundler.getConfig())
  const app = await server.start()

  app.on('listening', processEntries(args))
}
