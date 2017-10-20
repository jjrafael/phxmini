// http://webpack.github.io/docs/configuration.html
// http://webpack.github.io/docs/webpack-dev-server.html
var app_root = 'src'; // the app root folder: src, src_users, etc
var Path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var aliasList = require('./webpack.config.aliasList.js');
var webpack = require('webpack');

var envMap = {
  DEV: 'https://mswlar.lotus.local:8443/abp/',
  MSWDEV: 'https://msw.lotus.local:8443/abp/',
  TEST: 'https://mswlartest.lotus.local:8443/abp/',
  MSWTEST: 'https://mswtest.lotus.local:8443/abp/',
}

var env = 'DEV';
var args = process.argv;
for (var i = 0, l = args.length; i < l; i++) {
  if (args[i].indexOf('--env=') >= 0) {
    var _env = args[i].replace('--env=', '').toUpperCase();
    if (envMap[_env]) {
      env = _env;
    } else {
      console.log('Env ' + _env + ' not found. Setting back to default env.');
    }
  }
  if (args[i].indexOf('--url=') >= 0) {
    var url = args[i].replace('--url=', '');
    env = 'CUSTOM';
    envMap[env] =  url;
  }
}
var proxyUrl = envMap[env];

module.exports = {
  app_root: app_root, // the app root folder, needed by the other webpack configs
  entry: [
    // http://gaearon.github.io/react-hot-loader/getstarted/
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    __dirname + '/' + app_root + '/index.js',
  ],
  output: {
    path: __dirname + '/build/assets',
    publicPath: 'assets/',
    filename: 'bundle.js',
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src', './'],
    alias: aliasList
  }
  ,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        // https://github.com/jtangelder/sass-loader
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?name=[hash].[ext]'
        ]
      },
      {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file?name=[hash].[ext]'
      },
      {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file?name=[hash].[ext]'
      }
    ],
  },
  devServer: {
    contentBase: __dirname + '/build',
    historyApiFallback: true,
    proxy: {
      "/m/*": {
        target: proxyUrl,
        secure: false
      },
      "/rest/*": {
        target: proxyUrl,
        secure: false
      }
    },
    colors: true,
    inline: true,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(['assets/main.css', 'assets/bundle.js'], {
      root: __dirname + '/build',
      verbose: true,
      dry: false, // true for simulation
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: '#source-map'
};

function getSrcPath(srcPath) {
    return Path.resolve(__dirname, app_root, srcPath);
};
