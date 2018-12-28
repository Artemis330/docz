import { Arguments } from 'yargs'
import logger from 'signale'
import envDotProp from 'env-dot-prop'

import { Plugin } from '../Plugin'
import { Entries } from '../Entries'
import { DataServer } from '../DataServer'
import { parseConfig } from '../config/docz'
import { bundler as webpack } from '../webpack'
import * as states from '../states'

export const build = async (args: Arguments) => {
  const env = envDotProp.get('node.env')
  const config = await parseConfig(args)
  const entries = new Entries(config)

  const bundler = webpack(config, env)
  const bundlerConfig = await bundler.mountConfig(env)
  const run = Plugin.runPluginsMethod(config.plugins)
  const dataServer = new DataServer()

  if (args.propsParser) dataServer.register([states.props(config)])
  dataServer.register([states.config(config), states.entries(entries, config)])

  try {
    await Entries.writeApp(config, true)
    await dataServer.init()

    await run('onPreBuild', config)
    await bundler.build(bundlerConfig)

    await run('onPostBuild', config)
    await dataServer.close()
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
