import type { Mount, MountOptions } from "@mfe/contract";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
// RouterProvider comes from "react-router", not "react-router/dom": the dom entry
// carries its own copy of the router contexts, which would split from the shared copy.
import {
  RouterProvider,
  createBrowserRouter,
  createMemoryRouter,
  type RouteObject,
} from "react-router";
import { syncWithHost } from "./sync";

/**
 * Turns a route builder into the mount function a remote exposes.
 * Inside a host the remote gets a memory router that follows the host's URL;
 * standalone it owns the browser URL.
 */
export function createMount<Props extends object = object>(
  buildRoutes: (props: Props) => RouteObject[],
): Mount<Props> {
  return (element, options) => {
    const { initialPath, onNavigate, standalone, ...props } = (options ?? {}) as MountOptions &
      Props;
    const routes = buildRoutes(props as Props);
    const router = standalone
      ? createBrowserRouter(routes, { basename: __PUBLIC_BASE__ })
      : createMemoryRouter(routes, { initialEntries: [initialPath ?? "/"] });
    const sync = syncWithHost(router, onNavigate ?? (() => {}));
    const root = createRoot(element);
    root.render(createElement(RouterProvider, { router }));

    return {
      onHostNavigate: sync.onHostNavigate,
      unmount() {
        sync.stop();
        root.unmount();
        router.dispose();
      },
    };
  };
}
