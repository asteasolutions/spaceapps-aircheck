var path = require('path');
var webpack = require('webpack');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});
const dirname = path.resolve(__dirname, '.');
const cssFolderPath = path.resolve(dirname, 'css');

module.exports = {
  entry: [
    './js/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    devFlagPlugin,
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: `style!css?paths=${cssFolderPath}` },
      { test: /assets[\/\\].*$/, loader: 'file', query: 'name=assets/[name].[hash:11].[ext]' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
