const path = require("path");

module.exports = {
  mode: "development",

  devtool: "eval-source-map",

  devServer: {
    static: {
      directory: path.join(__dirname, "public")
    },

    port: 3000,

    open: true,

    hot: true
  }
};

/**
 * Developement-specific things 
 * mode: development
 * source maps
 * dev server
 * HMR
 */