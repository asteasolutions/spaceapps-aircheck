const path = require('path');
const webpack = require('webpack');

const devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
});
const dirname = path.resolve(__dirname, '.');
const cssFolderPath = path.resolve(dirname, 'css');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './js/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js',
    hot: true,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    devFlagPlugin,
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: `style!css?paths=${cssFolderPath}` },
      { test: /assets[\/\\].*$/, loader: 'file', query: 'name=assets/[name].[hash:11].[ext]' },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.json'],
  },
};
