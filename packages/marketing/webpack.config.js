const { createConfig } = require("../../webpack/create-config");

module.exports = (_env, { mode }) =>
  createConfig(
    { name: "marketing", dir: __dirname, exposes: { "./mount": "./src/mount.jsx" } },
    mode,
  );
