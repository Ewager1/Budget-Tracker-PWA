const path = require("path");

const config = {
  entry: __dirname + "./index.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  mode: "development",
};

module.exports = config;
