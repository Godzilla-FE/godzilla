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
    alias: {
      '@': path.resolve(__dirname, '../client'),
      'godzilla': path.resolve(__dirname, '../packages')
    },
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
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
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
