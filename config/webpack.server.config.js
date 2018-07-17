const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: path.resolve(__dirname, '../client/server-entry.js'),
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../dist'),
    filename: 'ssr_bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
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
            plugins: ['dynamic-import-node'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV,
        EXEC_ENV: 'NODE',
      }),
    }),
  ],
};
