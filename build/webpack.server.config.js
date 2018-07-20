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
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../client'),
      godzilla: path.resolve(__dirname, '../packages'),
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
        loader: 'null-loader',
      },
      {
        test: [/\.bmp$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              emitFile: false,
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
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
        BASE_URL: 'http://127.0.0.1:3001',
      }),
    }),
  ],
};
