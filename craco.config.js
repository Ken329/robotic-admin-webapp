const dotenv = require("dotenv");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

dotenv.config();

const ENV = process.env.DEPLOY_ENV || "uat";
const result = dotenv.config({ path: `./config/.env.${ENV}` });

if (result.error) {
  throw result.error;
}

const env = result.parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next.trim()}`] = JSON.stringify(env[next].trim());
  return prev;
}, {});

module.exports = {
  webpack: {
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new NodePolyfillPlugin({ excludeAliases: ["console"] }),
    ],
    configure: {
      resolve: {
        fallback: {},
      },
    },
  },
};
