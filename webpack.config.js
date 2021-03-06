const webpack = require('webpack');
const path = require('path');

const APP = path.join(__dirname, 'app');

module.exports = {
  // config goes here
  context: APP,
  entry: {
    app: ['webpack/hot/dev-server', './core/bootstrap.js']
  },
  module: {
      loaders: [
        { test: /\.js$/, loader: 'ng-annotate!babel?presets[]=es2015', exclude: /node_modules|bower_components/},
        { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/},

        { test: /\.json$/, loader: 'file-loader?name=[name].[ext]', exclude: /node_modules/ },

        { test: /\.html$/, loader: 'ng-cache?prefix=[dir]/[dir]' },

        // fonts
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&minetype=application/font-woff'
        },
        { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },

        // styles
        { test: /\.css$/, loader: 'style!css' },

        // images
        { test: /\.(jpg|png|gif)$/, loader: 'file'}
      ]
  },
  plugins: [
      new webpack.ProvidePlugin({
          d3: 'd3'
      }),
      new webpack.DefinePlugin({
        __LOGGING__: true,
        __PROXY__: true,
        __PROXY_URL__: JSON.stringify(require('./development.conf.json').proxyUrl),
        __SESSION_STORAGE__: true,
        __SHOW_ENDPOINT__: true,
        __VERSION__: JSON.stringify(require('./package.json').version)
      })
  ],
  devServer: {
    proxy: {
      '/sparql': {
        target: 'http://localhost:8081',
        rewrite: function (req) {
          req.url = req.url.replace(/^\/sparql\/?(.+)$/, '$1');
        }
      }
    }
  },
  output: {
    path: APP,
    filename: 'bundle.js'
  },
  devtool: 'source-map'
};
