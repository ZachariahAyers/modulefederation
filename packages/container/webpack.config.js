const path = require("node:path");
const { DefinePlugin } = require("webpack");
const { SINGLETONS, createConfig, remoteEntry } = require("../../webpack/create-config");
const { dependencies } = require("./package.json");

const REMOTES = ["marketing", "auth", "dashboard"];

const installedVersion = (name) =>
  require(require.resolve(path.join(name, "package.json"), { paths: [__dirname] })).version;

module.exports = (_env, { mode }) => {
  const production = mode === "production";
  const federation = {
    entries: Object.fromEntries(REMOTES.map((name) => [name, remoteEntry(name, production)])),
    shared: Object.keys(dependencies).map((name) => ({
      name,
      version: installedVersion(name),
      singleton: SINGLETONS.has(name),
    })),
  };

  return createConfig(
    {
      name: "container",
      dir: __dirname,
      remotes: REMOTES,
      plugins: [new DefinePlugin({ __FEDERATION__: JSON.stringify(federation) })],
    },
    mode,
  );
};
