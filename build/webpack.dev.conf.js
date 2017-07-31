const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const es3ifyWebpackPlugin = require('es3ify-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const utils = require('./utils');
const config = require('../config');
const baseWebpackConfig = require('./webpack.base.conf');

Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

function resolveApp(relativePath) {
  return path.resolve(relativePath);
}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('autoprefixer')({ browsers: ['ie>=8','>1% in CN'] })
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  devtool: '#cheap-module-source-map',
  cache: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new es3ifyWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      'jQuery': 'jquery'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs',
      favicon: resolveApp('favicon.ico'),
      assetsPath: config.dev.assetsPublicPath,
      inject: true,
      path:config.dev.staticPath
    }),
    new FriendlyErrorsPlugin()
  ]
});

module.exports = webpackConfig;
