const config = require('./baseConf');
const webpack = require('webpack');
const path = require('path');

const baseConf = config(false, true);

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, '../client/index.jsx'),
  output: {
    path: baseConf.config.outputPath,
    filename: '[name].js',
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    baseConf.pluginHtmlPlugin,
    baseConf.pluginDefinePlugin,
    baseConf.pluginDynamic,
  ],
};
