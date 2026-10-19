const assert = require("node:assert/strict");
const path = require("node:path");
const { test } = require("node:test");
const { createConfig, remoteEntry, sharedFrom } = require("./create-config");

const federation = (config) =>
  config.plugins.find((plugin) => plugin.constructor.name === "ModuleFederationPlugin");

test("remote entries point at localhost in development and at the app path in production", () => {
  assert.equal(remoteEntry("auth", false), "auth@http://localhost:8082/remoteEntry.js");
  assert.equal(remoteEntry("auth", true), "auth@/auth/remoteEntry.js");
});

test("framework packages are singletons; everything else is shared by version only", () => {
  assert.deepEqual(sharedFrom({ react: "^19.0.0", "chart.js": "^4.0.0" }), {
    react: { singleton: true, requiredVersion: "^19.0.0" },
    "chart.js": { singleton: false, requiredVersion: "^4.0.0" },
  });
});

test("the container consumes every remote and serves from the site root", () => {
  const dir = path.join(__dirname, "..", "packages", "container");
  const config = createConfig({ name: "container", dir, remotes: ["marketing"] }, "production");
  assert.equal(config.output.publicPath, "/");
  assert.equal(config.output.uniqueName, "container");
  assert.deepEqual(federation(config).options.remotes, {
    marketing: "marketing@/marketing/remoteEntry.js",
  });
});

test("a remote publishes remoteEntry.js under its own path", () => {
  const dir = path.join(__dirname, "..", "packages", "auth");
  const config = createConfig(
    { name: "auth", dir, exposes: { "./mount": "./src/mount.js" } },
    "production",
  );
  assert.equal(config.output.publicPath, "/auth/");
  assert.equal(federation(config).options.filename, "remoteEntry.js");
});
