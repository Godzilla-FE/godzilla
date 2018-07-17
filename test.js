const babel = require('@babel/core').transform;
const fs = require('fs');
const code = fs.readFileSync('./client/routes/Two/index.js', 'utf-8');
const path = require('path');
const config = require('./.babelrc');

// 需要移除
babel(code, {
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
    'syntax-dynamic-import',
    './packages/loadable/babel',
  ],
});
