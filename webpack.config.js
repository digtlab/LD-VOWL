'use strict';

var webpack = require('webpack');
var path = require('path');

var APP = __dirname + '/app';

module.exports = {
  // config goes here
  context: APP,
  entry: {
    app: ['webpack/hot/dev-server', './core/bootstrap.js']
  },
  module: {
      loaders: [
        {test: /\.js$/, loader: 'ng-annotate!babel?presets[]=es2015!jshint', exclude: /node_modules|bower_components/},

        // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
        // loads bootstrap's css.
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&minetype=application/font-woff" },
        { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
        { test: /\.css$/, loader: "style!css" }
      ]
  },
  plugins: [
      new webpack.ProvidePlugin({
          d3: 'd3',
          $: "jquery",
          jQuery: "jquery"
      })
  ],
  output: {
    path: APP,
    filename: 'bundle.js'
  }
};