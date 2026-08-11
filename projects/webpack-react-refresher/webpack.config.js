const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.common");

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    const prodConfig = require("./webpack.prod");

    return merge(commonConfig, prodConfig);
  }

  const devConfig = require("./webpack.dev");

  return merge(commonConfig, devConfig);
};

// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const dotenv = require("dotenv");
// const webpack = require("webpack");

// const env = dotenv.config().parsed;


// // Not recommended for production
// // const envKeys = Object.keys(env).reduce((acc, key) => {
// //   acc[`process.env.${key}`] = JSON.stringify(env[key]);
// //   return acc;
// // }, {});

// module.exports = {
//   mode: "development",

//   entry: "./src/index.jsx",

//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "bundle.js",
//     clean: true
//   },

//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader"
//         }
//       },

//       {
//         test: /\.s[ac]ss$/i,
//         use: [
//           "style-loader",
//           "css-loader",
//           "sass-loader"
//         ]
//       }
//     ]
//   },

//   resolve: {
//     extensions: [".js", ".jsx"]
//   },

//   plugins: [
//     new HtmlWebpackPlugin({
//       template: "./public/index.html"
//     }),

//     // not recommended for production
//     // new webpack.DefinePlugin(envKeys)

//     new webpack.DefinePlugin({
//       "process.env.APP_ENV": JSON.stringify(env.APP_ENV),
//       "process.env.API_BASE_URL": JSON.stringify(env.API_BASE_URL),
//       "process.env.APP_NAME": JSON.stringify(env.APP_NAME),
//       "process.env.FEATURE_NEW_DASHBOARD": JSON.stringify(env.FEATURE_NEW_DASHBOARD),

//       "process.env.BUILD_TIME": JSON.stringify(
//         new Date().toISOString()
//       )
// })
//   ],

//   devServer: {
//     static: {
//       directory: path.join(__dirname, "public")
//     },

//     port: 3000,

//     open: true,

//     hot: true
//   }
// };