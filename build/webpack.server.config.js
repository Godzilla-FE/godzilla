const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const baseConf = require('./baseConf');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: path.resolve(__dirname, '../client/server-entry.js'),
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs2',
    path: baseConf.config.outputPath,
    filename: 'ssr_bundle.js',
    publicPath: '/',
  },
  resolve: baseConf.resolve,
  module: {
    rules: [
      baseConf.jsRule,
      baseConf.imgRule,
      baseConf.otherRule,
      {
        test: /\.(less|css)$/,
        loader: 'null-loader',
      },
    ],
  },
  plugins: [baseConf.pluginDefinePlugin],
};
