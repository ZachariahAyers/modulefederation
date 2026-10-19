const { VueLoaderPlugin } = require("vue-loader");
const { createConfig } = require("../../webpack/create-config");

module.exports = (_env, { mode }) =>
  createConfig(
    {
      name: "dashboard",
      dir: __dirname,
      exposes: { "./mount": "./src/mount.js" },
      rules: [{ test: /\.vue$/, loader: "vue-loader" }],
      plugins: [new VueLoaderPlugin()],
    },
    mode,
  );
