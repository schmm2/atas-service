var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/app.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.js$/,
	exclude: "/node_modules/",
	loader: 'babel-loader'
      }
    ]
  }
}
