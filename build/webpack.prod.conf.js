const baseConf = require('./baseConf');
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, '../client/index.jsx'),
  output: {
    path: baseConf.config.outputPath,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: '/',
  },
  resolve: baseConf.resolve,
  module: {
    rules: [
      baseConf.jsRule,
      baseConf.cssRule,
      baseConf.imgRule,
      baseConf.lessRule,
      baseConf.otherRule,
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10, // 优先
          enforce: true,
        },
        commons: {
          chunks: 'async',
          minChunks: 2,
          minSize: 5000,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(path.basename(baseConf.config.outputPath), {
      root: path.dirname(baseConf.config.outputPath),
    }),
    baseConf.pluginHtmlPlugin,
    baseConf.pluginDefinePlugin,
    baseConf.pluginDynamic,
    baseConf.pluginMiniCss,
  ],
};
