const path = require("path");

const config = {
  mode: 'development',
  entry: __dirname + "./index.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  }
 
};

module.exports = config;
