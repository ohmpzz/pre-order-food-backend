const path = require('path');
const webpack = require('webpack');

require('@babel/polyfill');

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      PORT: JSON.stringify(process.env.PORT || '3003'),
      MONGO_URI: JSON.stringify(
        process.env.MONGO_URI || 'mongodb://product-db/admin'
      ),
      MONGO_USER: JSON.stringify(process.env.MONGO_USER || 'admin'),
      MONGO_PASS: JSON.stringify(process.env.MONGO_PASS || 'fastorder'),
      MICROSERVICE_SECRET: JSON.stringify(
        process.env.MICROSERVICE_SECRET || 'MICROSERVICE_SECRET'
      ),
      AUTH_SERVICE_URI: JSON.stringify('http://auth-service:3000/auth'),
      COMMU_SERVICE_URI: JSON.stringify(
        'http://community-service:3001/communities'
      ),
      PRODUCT_SERVICE_URI: JSON.stringify('http://http://localhost:3003'),
      ORDER_SERVICE_URI: JSON.stringify('http://order-service:3004/orders'),
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
