const webpack = require('webpack');
const path = require('path');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DynamicLoadablePlugin } = require('../packages/dynamic/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const isNode = process.env.TARGET === 'NODE';
// const isDev = process.env.NODE_ENV === 'development';

function mergeBaseConfig(baseConfig, mergeConfig) {
  const basePath = path.dirname(require.resolve('../config'));
  const defaultConfig = {
    outputPath: path.resolve(basePath, './dist'),
  };
  const config = {
    ...defaultConfig,
    ...baseConfig,
    ...mergeConfig,
  };

  config.outputPath = path.resolve(basePath, config.outputPath);

  return config;
}

module.exports = function getConfig(isNode, isDev) {
  const clientConfig = mergeBaseConfig(config, config.client);
  const serverConfig = mergeBaseConfig(config, config.server);

  const ret = {};

  ret.config = isNode ? serverConfig : clientConfig;

  const babelLoaderOpts = isNode
    ? {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: '8.9.4',
              },
              modules: false,
            },
          ],
          [
            '@babel/stage-2',
            {
              decoratorsLegacy: true,
            },
          ],
          '@babel/preset-react',
        ],
        plugins: ['dynamic-import-node', './packages/dynamic/babel.js'],
      }
    : {};

  ret.jsRule = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        ...babelLoaderOpts,
        babelrc: !isNode,
      },
    },
  };

  ret.cssRule = {
    test: /\.css$/,
    use: [
      isDev
        ? {
            loader: 'style-loader',
          }
        : {
            loader: MiniCssExtractPlugin.loader,
          },
      {
        loader: 'css-loader', // translates CSS into CommonJS
      },
      {
        loader: 'postcss-loader',
      },
    ],
  };

  ret.lessRule = {
    test: /\.less$/,
    use: [
      ...ret.cssRule.use,
      {
        loader: 'less-loader', // compiles Less to CSS
      },
    ],
  };

  ret.imgRule = {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: require.resolve('url-loader'),
    options: {
      emitFile: !isNode,
      limit: 10000,
      name: 'image/[name].[hash:8].[ext]',
    },
  };

  ret.otherRule = {
    exclude: [
      /\.html$/,
      /\.(js|jsx)(\?.*)?$/,
      /\.(ts|tsx)(\?.*)?$/,
      /\.css$/,
      /\.less$/,
      /\.json$/,
      /\.bmp$/,
      /\.gif$/,
      /\.jpe?g$/,
      /\.png$/,
    ],
    loader: require.resolve('file-loader'),
    options: {
      emitFile: !isNode,
      name: 'static/[name].[hash:8].[ext]',
    },
  };

  function parseDefineOptions(opts) {
    const retOpts = {};
    for (const key of Object.keys(opts)) {
      const option = opts[key];
      retOpts[key] = JSON.stringify(opts[key]);
    }
    return {
      'process.env': retOpts,
    };
  }

  ret.pluginDefinePlugin = new webpack.DefinePlugin(
    parseDefineOptions({
      NODE_ENV: process.env.NODE_ENV,
      EXEC_ENV: process.env.TARGET,
      BASE_URL: isNode ? serverConfig.baseURL : clientConfig.baseURL,
    }),
  );

  ret.pluginHtmlPlugin = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../client/index.html'),
    minify: isDev
      ? {}
      : {
          removeComments: false,
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
  });

  ret.pluginDynamic = new DynamicLoadablePlugin({
    filename: 'godzilla-dynamic.json',
  });

  ret.pluginMiniCss = new MiniCssExtractPlugin({
    filename: `css/[name]${isDev ? '' : '.[chunkhash:8]'}.css`,
    chunkFilename: `css/[id]${isDev ? '' : '.[chunkhash:8]'}.css`,
  });

  ret.resolve = {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../client'),
      godzilla: path.resolve(__dirname, '../packages'),
    },
  };

  return ret;
};
