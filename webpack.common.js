const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'], // Default for dev, overridden in prod.
      },
    ],
  },
  resolve: {
    fallback: {
      path: false,
      buffer: false,
      crypto: false,
      os: false,
    },
  },
};
