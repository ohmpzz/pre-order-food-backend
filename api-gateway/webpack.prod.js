const path = require('path');
const webpack = require('webpack');

require('@babel/polyfill');

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      PROXY_AUTH: JSON.stringify(
        process.env.PROXY_AUTH || 'http://auth-service:3000'
      ),
      PORT: JSON.stringify(process.env.PORT || 80),
      PROXY_COMMUNITY: JSON.stringify(
        process.env.PROXY_COMMUNITY || 'http://community-service:3001'
      ),
      PROXY_STORAGE: JSON.stringify(
        process.env.PROXY_STORAGE || 'http://storage-service:3002'
      ),
      PROXY_PRODUCT: JSON.stringify(
        process.env.PROXY_PRODUCT || 'http://product-service:3003'
      ),
      PROXY_ORDER: JSON.stringify(
        process.env.PROXY_ORDER || 'http://order-service:3004'
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
