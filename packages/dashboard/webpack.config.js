import vueLoader from "vue-loader";
import { createConfig } from "../../webpack/create-config.ts";

export default (_env, { mode }) =>
  createConfig(
    {
      name: "dashboard",
      dir: import.meta.dirname,
      exposes: { "./mount": "./src/mount.ts" },
      rules: [{ test: /\.vue$/, loader: "vue-loader" }],
      plugins: [new vueLoader.VueLoaderPlugin()],
    },
    mode,
  );
