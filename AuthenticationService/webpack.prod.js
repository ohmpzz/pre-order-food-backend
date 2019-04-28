const path = require('path');
const webpack = require('webpack');

require('@babel/polyfill');

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      PORT: JSON.stringify(process.env.PORT || 3000),
      LINE_LOGIN_CHANNEL_ID: JSON.stringify(
        process.env.LINE_LOGIN_CHANNEL_ID || '1614392673'
      ),
      LINE_LOGIN_CHANNEL_SECRET: JSON.stringify(
        process.env.LINE_LOGIN_CHANNEL_SECRET ||
          '3c3eb64681b806daeed9a6a2ef7ad66d'
      ),
      LINE_LOGIN_CALLBACK_URL: JSON.stringify(
        process.env.LINE_LOGIN_CALLBACK_URL ||
          'https://food-api.ohmpiromrak.com/auth/line/callback'
      ),
      MONGO_URI: JSON.stringify(
        process.env.MONGO_URI || 'mongodb://auth-db/admin'
      ),
      MONGO_USER: JSON.stringify(process.env.MONGO_USER || 'admin'),
      MONGO_PASS: JSON.stringify(process.env.MONGO_PASS || 'fastorder'),
      REDIRECT_URI: JSON.stringify(
        process.env.REDIRECT_URI || 'https://food.ohmpiromrak.com'
      ),
      COOKIE_DOMAIN: JSON.stringify(
        process.env.COOKIE_DOMAIN || '.ohmpiromrak.com'
      ),
      JWT_SECRET: JSON.stringify(process.env.JWT_SECRET || 'JWT_SECRET'),
      JWT_ADMIN_SECRET: JSON.stringify(
        process.env.JWT_ADMIN_SECRET || 'JWT_ADMIN_SECRET'
      ),
      MICROSERVICE_SECRET: JSON.stringify(
        process.env.MICROSERVICE_SECRET || 'MICROSERVICE_SECRET'
      ),
      LOGIN_USER_NAME: JSON.stringify(
        process.env.LOGIN_USER_NAME || 'ohm.piromrak@gmail.com'
      ),
      LOGIN_PASSWORD: JSON.stringify(
        process.env.LOGIN_PASSWORD || 'ohmFastOrder'
      ),
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
  resolve: {
    alias: {
      joi: 'joi-browser',
    },
  },
};
