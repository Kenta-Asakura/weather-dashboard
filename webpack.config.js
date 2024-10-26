const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 9000,
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  },
};
