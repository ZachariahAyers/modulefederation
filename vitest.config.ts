import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  define: {
    // The container's build injects this; tests get a fixed sample.
    __FEDERATION__: JSON.stringify({
      entries: {
        marketing: "/marketing/remoteEntry.js",
        auth: "/auth/remoteEntry.js",
        dashboard: "/dashboard/remoteEntry.js",
      },
      shared: [
        { name: "react", version: "19.3.1", singleton: true },
        { name: "react-router", version: "7.18.4", singleton: true },
      ],
    }),
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/*/src/**/*.test.{ts,tsx}", "webpack/*.test.ts"],
    restoreMocks: true,
  },
});
