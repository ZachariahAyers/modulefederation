import { readFileSync } from "node:fs";
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack, { type RuleSetRule, type WebpackPluginInstance } from "webpack";

const { ModuleFederationPlugin } = webpack.container;

/** Packages loaded once at runtime; whichever app loads first provides the copy. */
export const SINGLETONS = new Set(["react", "react-dom", "react-router", "vue"]);

/** Where each app runs in development, and its folder under the site's base in production. */
export const APPS = {
  container: { port: 8080, path: "" },
  marketing: { port: 8081, path: "marketing/" },
  auth: { port: 8082, path: "auth/" },
  dashboard: { port: 8083, path: "dashboard/" },
} as const;

export type AppName = keyof typeof APPS;

/** The path the site is served under in production: PUBLIC_BASE, with one slash each side, or `/`. */
export const publicBase = (value = process.env.PUBLIC_BASE ?? "") =>
  `/${value.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");

/** Where one app is served from in production. */
export const appBase = (name: AppName, base = publicBase()) => base + APPS[name].path;

export interface AppOptions {
  name: AppName;
  /** The app's package directory. */
  dir: string;
  /** Modules a remote offers, keyed by the path a host imports. */
  exposes?: Record<string, string>;
  /** Apps a host consumes. */
  remotes?: AppName[];
  rules?: RuleSetRule[];
  plugins?: WebpackPluginInstance[];
}

export const remoteEntry = (name: AppName, production: boolean) =>
  production
    ? `${name}@${appBase(name)}remoteEntry.js`
    : `${name}@http://localhost:${APPS[name].port}/remoteEntry.js`;

export const sharedFrom = (dependencies: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(dependencies).map(([dep, range]) => [
      dep,
      { singleton: SINGLETONS.has(dep), requiredVersion: range },
    ]),
  );

export const readDependencies = (dir: string): Record<string, string> =>
  JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8")).dependencies ?? {};

const babel = {
  loader: "babel-loader",
  options: {
    presets: [
      "@babel/preset-env",
      ["@babel/preset-react", { runtime: "automatic" }],
      "@babel/preset-typescript",
    ],
    // Script blocks in .vue files keep the .vue filename, so the TypeScript preset needs telling.
    overrides: [
      { test: /\.vue$/, presets: [["@babel/preset-typescript", { ignoreExtensions: true }]] },
    ],
  },
};

/** Builds the webpack config for one app. `mode` is webpack's --mode. */
export function createConfig(
  { name, dir, exposes, remotes = [], rules = [], plugins = [] }: AppOptions,
  mode?: string,
) {
  const production = mode === "production";
  const { port } = APPS[name];

  return {
    mode: production ? "production" : "development",
    context: dir,
    entry: "./src/index.ts",
    devtool: production ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.join(dir, "dist"),
      filename: production ? "[name].[contenthash].js" : "[name].js",
      publicPath: production ? appBase(name) : `http://localhost:${port}/`,
      uniqueName: name,
      clean: true,
    },
    resolve: { extensions: [".ts", ".tsx", ".js", ".vue"] },
    // Explicit, because vue-loader's rules would otherwise switch native CSS off.
    experiments: { css: true },
    module: {
      // Class names are scoped per app; custom properties stay global so the theme tokens reach every app.
      parser: { "css/auto": { exportType: "style", dashedIdents: false } },
      generator: {
        "css/auto": { localIdentName: "[uniqueName]-[local]-[hash:base64:5]" },
      },
      rules: [{ test: /\.[jt]sx?$/, exclude: /node_modules/, use: babel }, ...rules],
    },
    plugins: [
      new ModuleFederationPlugin({
        name,
        ...(exposes && { filename: "remoteEntry.js", exposes }),
        remotes: Object.fromEntries(
          remotes.map((remote) => [remote, remoteEntry(remote, production)]),
        ),
        shared: sharedFrom(readDependencies(dir)),
      }),
      // The browser router's basename, so routes and links stay under the site's base.
      new webpack.DefinePlugin({
        __PUBLIC_BASE__: JSON.stringify(production ? publicBase() : "/"),
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
