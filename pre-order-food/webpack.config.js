const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const NodemonPlugin = require('nodemon-webpack-plugin');

require('@babel/polyfill');

let plugins = [
  new Dotenv({
    path: path.resolve(__dirname, './.env'),
  }),
  new NodemonPlugin(),
];

if (process.env.NODE_ENV == 'production') {
  plugins = [
    new Dotenv({
      path: path.resolve(__dirname, './.env'),
    }),
  ];
}

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
  mode: process.env.NODE_ENV || 'development',
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
