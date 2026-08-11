const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = dotenv.config().parsed || {};

const envKeys = Object.keys(env).reduce((acc, key) => {
  acc[`process.env.${key}`] = JSON.stringify(env[key]);
  return acc;
}, {});

module.exports = {
  entry: "./src/index.jsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),

    new webpack.DefinePlugin({
      ...envKeys,

      "process.env.BUILD_TIME": JSON.stringify(
        new Date().toISOString()
      )
    })
  ]
};

/**
 * What belongs here?
 * - Things needed by both develpoment and production:
 * entry 
 * output
 * loaders
 * React/Babel
 * Sass
 * HtmlWebpackPlugin
 * DefinePlugin
 */