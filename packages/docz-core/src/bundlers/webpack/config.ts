import * as path from 'path'
import { load } from 'load-cfg'
import merge from 'deepmerge'
import webpackBarPlugin from 'webpackbar'
import Config from 'webpack-chain'
import HappyPack from 'happypack'
import friendlyErrors from 'friendly-errors-webpack-plugin'
import htmlWebpackPlugin from 'html-webpack-plugin'
import manifestPlugin from 'webpack-manifest-plugin'
import UglifyJs from 'uglifyjs-webpack-plugin'
import matter from 'remark-frontmatter'

import { Config as ConfigObj } from '../../commands/args'
import { plugin as mdastPlugin } from '../../utils/plugin-mdast'
import { plugin as hastPlugin } from '../../utils/plugin-hast'
import { Env } from './'

const INLINE_LIMIT = 10000

interface HappypackLoaderParams {
  id: string
  plugins?: any[]
}

const getBabelRc = (debug: boolean) =>
  merge(load('babel', null), {
    babelrc: false,
    cacheDirectory: !debug,
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [],
  })

const happypackLoader = (babelrc: any) => ({
  id,
  plugins,
}: HappypackLoaderParams) => [
  {
    id,
    threads: 2,
    verbose: false,
    loaders: [
      {
        loader: require.resolve('babel-loader'),
        query: {
          ...babelrc,
          plugins,
        },
      },
    ],
  },
]

const setupHappypack = (config: Config, babelrc: any) => {
  const loader = happypackLoader(babelrc)

  const jsx = loader({
    id: 'jsx',
    plugins: babelrc.plugins.concat([
      require.resolve('react-hot-loader/babel'),
      require.resolve('babel-plugin-react-docgen'),
    ]),
  })

  const mdx = loader({
    id: 'mdx',
    plugins: babelrc.plugins,
  })

  config.plugin('happypack-jsx').use(HappyPack, jsx)
  config.plugin('happypack-mdx').use(HappyPack, mdx)
}

export const createConfig = (args: ConfigObj, env: Env): Config => {
  const { paths, debug } = args

  const srcPath = path.resolve(paths.root, args.src)
  const isProd = env === 'production'
  const config = new Config()

  /**
   * general
   */
  config.context(paths.root)
  config.set('mode', env)

  config.when(debug, cfg => cfg.devtool('source-map'))
  config.when(!isProd, cfg => cfg.devtool('cheap-module-eval-source-map'))

  config.node.merge({
    child_process: 'empty',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  })

  /**
   * output
   */
  const outputProd = (output: Config.Output) =>
    output
      .filename('static/js/[name].[chunkhash:8].js')
      .sourceMapFilename('static/js/[name].[chunkhash:8].js.map')
      .publicPath(paths.servedPath)

  const outputDev = (output: Config.Output) =>
    output
      .filename('static/js/[name].js')
      .sourceMapFilename('static/js/[name].js.map')
      .publicPath('/')

  config.output
    .pathinfo(true)
    .path(paths.dist)
    .when(isProd, outputProd, outputDev)
    .crossOriginLoading('anonymous')

  /**
   * optimization
   */

  config.merge({
    optimization: {
      nodeEnv: 'dev',
      namedModules: true,
      noEmitOnErrors: true,
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        name: 'vendors',
      },
    },
  })

  if (isProd) {
    config.merge({
      optimization: {
        minimizer: [
          new UglifyJs({
            uglifyOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            cache: true,
            sourceMap: true,
          }),
        ],
      },
    })
  }

  /**
   * entries
   */

  config
    .entry('app')
    .add(require.resolve('babel-polyfill'))
    .add(paths.indexJs)

  /**
   * resolve
   */

  config.resolve
    .set('symlinks', true)
    .alias.set(
      '@babel/runtime',
      path.dirname(require.resolve('@babel/runtime/package.json'))
    )

  config.resolve.extensions
    .merge(['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', '.mdx'])
    .end()
    .modules.add('node_modules')
    .add(srcPath)

  config.resolveLoader
    .set('symlinks', true)
    .modules.add('node_modules')
    .add(paths.root)

  /**
   * loaders
   */

  config.module
    .rule('js')
    .test(/\.js?x$/)
    .include.add(srcPath)
    .add(paths.docz)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-jsx')
    .loader('happypack/loader?id=jsx')

  config.module
    .rule('mdx')
    .test(/\.md?x$/)
    .include.add(srcPath)
    .add(paths.docz)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-mdx')
    .loader('happypack/loader?id=mdx')
    .end()
    .use('mdx-loader')
    .loader(require.resolve('@mdx-js/loader'))
    .options({
      type: 'yaml',
      marker: '-',
      mdPlugins: args.mdPlugins.concat([matter, mdastPlugin]),
      hastPlugins: args.hastPlugins.concat([hastPlugin]),
    })

  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/img/[name].[hash:8].[ext]`,
    })

  config.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: `static/img/[name].[hash:8].[ext]`,
    })

  config.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/media/[name].[hash:8].[ext]`,
    })

  config.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/fonts/[name].[hash:8].[ext]`,
    })

  /**
   * plugins
   */

  setupHappypack(config, getBabelRc(args.debug))

  config.plugin('assets-plugin').use(manifestPlugin, [
    {
      filename: 'assets.json',
    },
  ])

  config.plugin('html-webpack-plugin').use(htmlWebpackPlugin, [
    {
      inject: true,
      template: paths.indexHtml,
      ...(isProd && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    },
  ])

  config.when(!debug && !isProd, cfg => {
    cfg.plugin('webpackbar').use(webpackBarPlugin, [
      {
        color: '#41b883',
        compiledIn: false,
        name: 'Client',
      },
    ])
    cfg.plugin('friendly-errors').use(friendlyErrors)
  })

  config.performance.hints(false)
  return config
}
