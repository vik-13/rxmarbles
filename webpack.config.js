'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const gitPackage = require('./package.json');
const TerserPlugin = require("terser-webpack-plugin");

const rxjsVersion = gitPackage.devDependencies.rxjs;
const appVersion = gitPackage.version;

const optimization = {};
const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      { from: 'src/index.html' },
      { from: 'src/index.css' },
    ]
  }),
  new webpack.DefinePlugin({
    RXJS_VERSION: `"${rxjsVersion}"`,
  })
];

if (isProduction) {
  optimization.minimizer = [
    new TerserPlugin()
  ]
}

module.exports = {
  entry: './src/app.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization,
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },

  devtool: isProduction ?
    'source-map' :
    'inline-source-map',

  devServer: {
    historyApiFallback: { index: '/' },
    proxy: {},
    host: '0.0.0.0',
    port: '8081'
  },
  plugins
};
