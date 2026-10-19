/** Written by the container's webpack config from the same data Module Federation uses. */
declare const __FEDERATION__: {
  entries: Record<string, string>;
  shared: { name: string; version: string; singleton: boolean }[];
};

// Each remote's `./mount`, resolved at runtime through its remoteEntry.js.
declare module "marketing/mount" {
  export const mount: import("@mfe/contract").Mount;
}

declare module "auth/mount" {
  export const mount: import("@mfe/contract").Mount<import("@mfe/contract").AuthProps>;
}

declare module "dashboard/mount" {
  export const mount: import("@mfe/contract").Mount;
}
