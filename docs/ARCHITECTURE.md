# Architecture

## Apps

| App         | Framework | Role                                          | Exposes   | Dev port | Production path |
| ----------- | --------- | --------------------------------------------- | --------- | -------- | --------------- |
| `container` | React 19  | Host: owns the URL, header and explorer panel | nothing   | 8080     | `/`             |
| `marketing` | React 19  | `/`, `/how-it-works`, and the not-found page  | `./mount` | 8081     | `/marketing/`   |
| `auth`      | React 19  | `/auth/signin`, `/auth/signup`                | `./mount` | 8082     | `/auth/`        |
| `dashboard` | Vue 3.5   | `/dashboard`, shown only when signed in       | `./mount` | 8083     | `/dashboard/`   |

Each app is its own npm workspace with its own webpack build and output folder. No app imports another app's code; the host reaches remotes only through Module Federation at runtime.

## Shared packages

These are workspace packages compiled into the apps that use them. They are shared source, not runtime modules, so they never couple two deploys.

- `@mfe/contract`: types only. `Mount`, `MountOptions`, `MountedApp` and `AuthProps`.
- `@mfe/react-mount`: `createMount(routes)` turns a React route tree into a `Mount`. `syncWithHost` keeps the remote's router and the host's router on the same path.
- `@mfe/theme`: CSS custom properties for colour, type and radius (light and dark), plus the global `.button` and `.card` classes.

## Build

`webpack/create-config.ts` produces every app's config, so all four builds differ only in their options:

- `ModuleFederationPlugin` (built into webpack). Remotes publish `remoteEntry.js`. Every entry in an app's `dependencies` is shared; `react`, `react-dom`, `react-router` and `vue` are singletons, and each app's version range becomes its `requiredVersion`.
- `output.uniqueName` is the app name. CSS Modules use it in class names (`auth-field-wwz9t`), so two apps can both define `.title`.
- CSS goes through webpack's native CSS support, injected as `<style>` at runtime. Custom properties are left unscoped (`dashedIdents: false`) so the theme tokens reach every module.
- Babel compiles TypeScript, TSX and the script blocks of `.vue` files. `vue-tsc` does the type checking; the build does not.
- The container's build writes `__FEDERATION__`: each remote's entry URL and the installed version of every package it shares, for the explorer panel.

## How a remote loads

```mermaid
sequenceDiagram
  participant B as Browser
  participant C as Container
  participant R as Remote (remoteEntry.js)
  B->>C: GET / (index.html, main.js)
  C->>C: match the URL to a remote
  C->>R: import("auth/mount")
  R-->>C: container interface; shared packages negotiated
  C->>R: mount(element, { initialPath, onNavigate, onSignIn })
  R-->>C: { unmount, onHostNavigate }
```

1. Every app's `index.ts` only imports the real entry (`./bootstrap` in the container, `./standalone` in a remote). That async boundary lets the share scope settle before any app code runs.
2. The container's routes render `RemoteApp` with an entry from `remotes.ts`.
3. `RemoteApp` calls `loadRemote`, which imports the remote once, records `loading`, then `loaded` with the measured time or `failed` with the error. A failed load is forgotten so the next visit retries it.
4. Once loaded, `RemoteApp` calls `mount` on a `<div>` it owns. On leaving the route it calls `unmount` in a microtask, because a React root cannot be unmounted while the host is committing.
5. If the load fails, `RemoteApp` shows an alert in the remote's place; the header and every other route keep working.

## Navigation

The host owns the address bar through `BrowserRouter`. A React remote runs a memory router when hosted, and a browser router when standalone.

- Host to remote: when the host's path changes, `RemoteApp` calls `onHostNavigate(path)`, and the remote navigates if it is elsewhere.
- Remote to host: `syncWithHost` subscribes to the remote's router and calls `onNavigate(path)` for navigations the host did not start. The host navigates, which updates the address bar and history.
- Neither side echoes a change back, so the two routers never loop.

The Vue dashboard has one route and no router; its `mount` returns no `onHostNavigate`.

## Sign-in

Sign-in is a demo: any values sign in and nothing leaves the browser. The container holds `signedIn` in React state and passes `onSignIn` to the Auth remote through `mount`. Signing in navigates to `/dashboard`; the dashboard route redirects to `/auth/signin` while signed out. State is in memory, so a reload signs out.

## Deployment

The Dockerfile builds every app and copies each `dist` into one nginx root: the container at `/`, remotes under their paths. `nginx.conf` serves `remoteEntry.js` with `Cache-Control: no-cache` and hashed chunks as immutable, so a remote can be redeployed alone and the host picks it up on the next page load.

`PUBLIC_BASE` moves the whole site under one path: `PUBLIC_BASE=/opensource/modulefederation/ npm run build` gives every app its production path under that prefix, and the host and standalone routers use it as their basename. Unset, the site is served from `/`. The `demo` workflow builds this way and publishes to [ayers.repair/opensource/modulefederation](https://ayers.repair/opensource/modulefederation/).

## Tests

Vitest runs every `*.test.ts(x)` in jsdom. Tests drive the real components and routers and find elements by role or label. Remotes are faked only at the federation boundary (`remotes.ts`), and Chart.js is mocked because jsdom has no canvas.
