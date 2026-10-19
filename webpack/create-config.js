const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

// One copy of these at runtime, whichever app loads first provides it.
const SINGLETONS = new Set(["react", "react-dom", "react-router", "vue"]);

const APPS = {
  container: { port: 8080, base: "/" },
  marketing: { port: 8081, base: "/marketing/" },
  auth: { port: 8082, base: "/auth/" },
  dashboard: { port: 8083, base: "/dashboard/" },
};

const remoteEntry = (name, production) =>
  production
    ? `${name}@${APPS[name].base}remoteEntry.js`
    : `${name}@http://localhost:${APPS[name].port}/remoteEntry.js`;

const sharedFrom = (dependencies) =>
  Object.fromEntries(
    Object.entries(dependencies).map(([dep, range]) => [
      dep,
      { singleton: SINGLETONS.has(dep), requiredVersion: range },
    ]),
  );

/**
 * Builds the webpack config for one app.
 * @param {object} options
 * @param {string} options.name key of APPS
 * @param {string} options.dir the app's package directory
 * @param {Record<string, string>} [options.exposes] modules a remote offers
 * @param {string[]} [options.remotes] apps a host consumes
 * @param {object[]} [options.rules] extra module rules (Vue)
 * @param {object[]} [options.plugins] extra plugins
 */
function createConfig(
  { name, dir, exposes, remotes = [], rules = [], plugins = [] },
  mode,
) {
  const production = mode === "production";
  const { port, base } = APPS[name];
  const { dependencies = {} } = require(path.join(dir, "package.json"));

  return {
    mode: production ? "production" : "development",
    context: dir,
    entry: "./src/index.js",
    devtool: production ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.join(dir, "dist"),
      filename: production ? "[name].[contenthash].js" : "[name].js",
      publicPath: production ? base : `http://localhost:${port}/`,
      uniqueName: name,
      clean: true,
    },
    resolve: { extensions: [".js", ".jsx", ".vue"] },
    // Explicit, because vue-loader's rules would otherwise switch native CSS off.
    experiments: { css: true },
    module: {
      // Class names are scoped per app; custom properties stay global so the theme tokens reach every app.
      parser: { "css/auto": { exportType: "style", dashedIdents: false } },
      generator: {
        "css/auto": { localIdentName: "[uniqueName]-[local]-[hash:base64:5]" },
      },
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
        },
        ...rules,
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name,
        ...(exposes && { filename: "remoteEntry.js", exposes }),
        remotes: Object.fromEntries(
          remotes.map((remote) => [remote, remoteEntry(remote, production)]),
        ),
        shared: sharedFrom(dependencies),
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      ...plugins,
    ],
    devServer: {
      port,
      historyApiFallback: true,
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  };
}

module.exports = { APPS, SINGLETONS, createConfig, remoteEntry, sharedFrom };
