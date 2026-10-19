import { createConfig } from "../../webpack/create-config.ts";

export default (_env, { mode }) =>
  createConfig(
    { name: "auth", dir: import.meta.dirname, exposes: { "./mount": "./src/mount.tsx" } },
    mode,
  );
