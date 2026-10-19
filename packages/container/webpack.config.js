import { createRequire } from "node:module";
import webpack from "webpack";
import {
  SINGLETONS,
  createConfig,
  readDependencies,
  remoteEntry,
} from "../../webpack/create-config.ts";

const REMOTES = ["marketing", "auth", "dashboard"];
const require = createRequire(import.meta.url);

/** Facts the explorer panel shows, taken from the same sources Module Federation uses. */
const federationFacts = (production) => ({
  entries: Object.fromEntries(
    REMOTES.map((name) => [name, remoteEntry(name, production).split("@")[1]]),
  ),
  shared: Object.keys(readDependencies(import.meta.dirname)).map((name) => ({
    name,
    version: require(`${name}/package.json`).version,
    singleton: SINGLETONS.has(name),
  })),
});

export default (_env, { mode }) =>
  createConfig(
    {
      name: "container",
      dir: import.meta.dirname,
      remotes: REMOTES,
      plugins: [
        new webpack.DefinePlugin({
          __FEDERATION__: JSON.stringify(federationFacts(mode === "production")),
        }),
      ],
    },
    mode,
  );
