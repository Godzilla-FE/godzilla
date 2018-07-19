module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions'],
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
  plugins: [
    '@babel/plugin-transform-runtime',
    'react-hot-loader/babel',
    'syntax-dynamic-import',
    './packages/Dynamic/babel',
  ],
};
