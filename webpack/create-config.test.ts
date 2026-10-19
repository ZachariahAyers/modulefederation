import path from "node:path";
import webpack from "webpack";
import { describe, expect, it, vi } from "vitest";
import { appBase, createConfig, publicBase, remoteEntry, sharedFrom } from "./create-config.ts";

const { ModuleFederationPlugin } = webpack.container;
const root = path.resolve(import.meta.dirname, "..");
type Federation = InstanceType<typeof ModuleFederationPlugin>;

const federationOptions = (config: ReturnType<typeof createConfig>) =>
  config.plugins.find((plugin): plugin is Federation => plugin instanceof ModuleFederationPlugin)!
    .options;

describe("createConfig", () => {
  it("points remote entries at localhost in development and at the app's path in production", () => {
    expect(remoteEntry("auth", false)).toBe("auth@http://localhost:8082/remoteEntry.js");
    expect(remoteEntry("auth", true)).toBe("auth@/auth/remoteEntry.js");
  });

  it("serves every app from the site root unless PUBLIC_BASE moves it", () => {
    expect(publicBase("")).toBe("/");
    expect(publicBase("/")).toBe("/");
    expect(publicBase("opensource/modulefederation")).toBe("/opensource/modulefederation/");
    expect(appBase("container", publicBase("/opensource/modulefederation/"))).toBe(
      "/opensource/modulefederation/",
    );
    expect(appBase("dashboard", publicBase("/opensource/modulefederation/"))).toBe(
      "/opensource/modulefederation/dashboard/",
    );
  });

  it("builds every production path from PUBLIC_BASE", () => {
    vi.stubEnv("PUBLIC_BASE", "/opensource/modulefederation/");
    const config = createConfig(
      { name: "container", dir: path.join(root, "packages/container"), remotes: ["auth"] },
      "production",
    );

    expect(config.output.publicPath).toBe("/opensource/modulefederation/");
    expect(federationOptions(config).remotes).toEqual({
      auth: "auth@/opensource/modulefederation/auth/remoteEntry.js",
    });
    const define = config.plugins.find(
      (plugin): plugin is InstanceType<typeof webpack.DefinePlugin> =>
        plugin instanceof webpack.DefinePlugin,
    )!;
    expect(define.definitions.__PUBLIC_BASE__).toBe('"/opensource/modulefederation/"');
  });

  it("shares framework packages as singletons and everything else by version range", () => {
    expect(sharedFrom({ react: "^19.0.0", "chart.js": "^4.0.0" })).toEqual({
      react: { singleton: true, requiredVersion: "^19.0.0" },
      "chart.js": { singleton: false, requiredVersion: "^4.0.0" },
    });
  });

  it("serves the host from the site root and consumes the remotes it names", () => {
    const config = createConfig(
      { name: "container", dir: path.join(root, "packages/container"), remotes: ["marketing"] },
      "production",
    );

    expect(config.output.publicPath).toBe("/");
    expect(config.output.uniqueName).toBe("container");
    expect(federationOptions(config).remotes).toEqual({
      marketing: "marketing@/marketing/remoteEntry.js",
    });
    expect(federationOptions(config).filename).toBeUndefined();
  });

  it("publishes a remote's remoteEntry.js under its own path", () => {
    const config = createConfig(
      {
        name: "auth",
        dir: path.join(root, "packages/auth"),
        exposes: { "./mount": "./src/mount.tsx" },
      },
      "production",
    );

    expect(config.output.publicPath).toBe("/auth/");
    expect(federationOptions(config).filename).toBe("remoteEntry.js");
    expect(federationOptions(config).shared).toMatchObject({ react: { singleton: true } });
  });

  it("serves from localhost with readable file names in development", () => {
    const config = createConfig(
      { name: "dashboard", dir: path.join(root, "packages/dashboard") },
      "development",
    );

    expect(config.output.publicPath).toBe("http://localhost:8083/");
    expect(config.output.filename).toBe("[name].js");
  });
});
