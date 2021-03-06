const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const merge = require("webpack-merge");
const parts = require("./webpack.parts");

const port = 3000;

const PATHS = {
  src: path.join(__dirname, "src"),
  dist: path.join(__dirname, "dist")
};

const commonConfig = merge([
  {
    entry: [
      path.join(PATHS.src, "css/style.css"),
      path.join(PATHS.src, "js/script.js")
    ],
    output: {
      path: PATHS.dist,
      filename: `js/script.[hash].js`
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.html$/,
          loader: `html-loader`
        },
        {
          test: /\.(jpe?g|png|svg|woff|woff2)$/,
          loader: `file-loader`,
          options: {
            // limit: 1000,
            context: `./src`,
            name: `[path][name].[ext]`
          }
        },
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          loader: `babel-loader`
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {}
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })]
  }
]);

const productionConfig = merge([
  {
    output: {
      publicPath: "./"
    }
  },
  parts.extractCSS()
]);

const developmentConfig = merge([
  {
    entry: ["./src/index.html"]
  },
  parts.loadCSS(),
]);

module.exports = env => {
  if (process.env.NODE_ENV === 'production') {
    console.log("building production");
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig, developmentConfig);
};
