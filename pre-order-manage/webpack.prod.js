const path = require('path');
const webpack = require('webpack');

require('@babel/polyfill');

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      PORT: JSON.stringify(process.env.PORT || '80'),
    },
  }),
];

module.exports = {
  entry: ['@babel/polyfill', './server.js'],
  target: 'node',
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'index.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins,
};
