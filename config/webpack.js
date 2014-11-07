/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

var webpack = require('webpack');

module.exports = function (release) {
  return {
    output: {
      path: release ? './build/' : './stage',
      filename: 'app.js',
      publicPatch: release ? './build/' : './stage'
    },

    cache: !release,
    debug: !release,
    devtool: release ? false : "#inline-source-map",
    entry: './src/scripts/index.js',

    stats: {
      colors: true,
      reasons: !release
    },

    plugins: release ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : [
      // new webpack.ProvidePlugin({
      // React: "react/addons",
      // moment: "moment",
      // Tether: "tether"
      // })
    ],

    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.ls']
    },

    module: {
      preLoaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint'
      }],
      loaders: [{
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&mimetype=image/gif'
      },
      {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&mimetype=image/jpg'
      },
      {
        test: /\.png/,
        loader: 'url-loader?limit=10000&mimetype=image/png'
      },
      // {
      //   exclude: /node_modules/,
      //   test: /\.(js|jsx)$/, 
      //   loader: 'sweetjs?modules[]=./macros.sjs,readers[]=jsx-reader'
      // },
      {
        test: /\.(js|jsx)$/,
        loader: 'jsx-loader?harmony'
      },
      {
        test: /\.ls$/,
        loader: 'livescript-loader'
      }]
    }
  };
};
