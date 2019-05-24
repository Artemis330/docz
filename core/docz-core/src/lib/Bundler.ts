import * as path from 'path'
import logger from 'signale'

import { Plugin } from './Plugin'
import { Config as Args, Env } from '../config/argv'
import * as paths from '../config/paths'

export interface ServerHooks {
  onCreateWebpackChain<C>(config: C, dev: boolean, args: Args): void
  onPreCreateApp<A>(app: A): void
  onCreateApp<A>(app: A): void
  onServerListening<S>(server: S): void
}

export interface BundlerServer {
  start(): void
}

export type ConfigFn<C> = (hooks: ServerHooks) => Promise<C>
export type BuildFn<C> = (config: C, dist: string) => void
export type ServerFn<C> = (
  config: C,
  hooks: ServerHooks
) => BundlerServer | Promise<BundlerServer>

export interface BundlerConstructor<Config> {
  args: Args
  config: ConfigFn<Config>
  server: ServerFn<Config>
  build: BuildFn<Config>
}

export interface ConfigObj {
  [key: string]: any
}

export class Bundler<C = ConfigObj> {
  private readonly args: Args
  private config: ConfigFn<C>
  private server: ServerFn<C>
  private builder: BuildFn<C>
  private hooks: ServerHooks

  constructor(params: BundlerConstructor<C>) {
    const { args, config, server, build } = params
    const run = Plugin.runPluginsMethod(args.plugins)

    this.args = args
    this.config = config
    this.server = server
    this.builder = build

    this.hooks = {
      onCreateWebpackChain<C>(config: C, dev: boolean, args: Args): void {
        run('onCreateWebpackChain', config, dev, args)
      },
      onPreCreateApp<A>(app: A): void {
        run('onPreCreateApp', app)
      },
      onCreateApp<A>(app: A): void {
        run('onCreateApp', app)
      },
      onServerListening<S>(server: S): void {
        run('onServerListening', server)
      },
    }
  }

  public async mountConfig(env: Env): Promise<C> {
    const { plugins } = this.args
    const isDev = env !== 'production'
    const reduce = Plugin.reduceFromPlugins<C>(plugins)
    const userConfig = await this.config(this.hooks)
    const config = reduce('modifyBundlerConfig', userConfig, isDev, this.args)

    return this.args.modifyBundlerConfig(config, isDev, this.args)
  }

  public async createApp(config: C): Promise<BundlerServer> {
    return this.server(config, this.hooks)
  }

  public async build(config: C): Promise<void> {
    const dist = paths.getDist(this.args.dest)

    if (paths.root === path.resolve(dist)) {
      logger.fatal(
        new Error(
          'Unexpected option: "dest" cannot be set to the current working directory.'
        )
      )
      process.exit(1)
    }

    await this.builder(config, dist)
  }
}
