const dotenv = require("dotenv");
const webpack = require("webpack");
const path = require('path');
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
      // react-datepicker optionally requires date-fns-tz via a variable (only used with the
      // `timeZone` prop, which this app does not use), which webpack flags as a critical dependency.
      ignoreWarnings: [
        {
          module: /react-datepicker[\/]dist[\/]index.es.js/,
          message: /Critical dependency: the request of a dependency is an expression/
        }
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@pages': path.resolve(__dirname, 'src/pages'),
          '@utils': path.resolve(__dirname, 'src/utils'),
          '@redux': path.resolve(__dirname, 'src/redux'),
          '@services': path.resolve(__dirname, 'src/services'),
          '@assets': path.resolve(__dirname, 'src/assets'),
        },
        fallback: {},
      },
    },
  },
};
