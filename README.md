# Module Federation

Four independently built web apps, three in React and one in Vue, composed into a single page at runtime with webpack Module Federation.

By [Zachariah Ayers](https://ayers.repair) · [GitHub](https://github.com/ZachariahAyers)

## What it is

A host application, the **Container**, owns the URL and the page chrome. It loads three remote applications on demand:

| App | Framework | Dev port | Owns |
| --- | --- | --- | --- |
| Container | React 19 | 8080 | Header, routing, the explorer panel |
| Marketing | React 19 | 8081 | `/`, `/how-it-works` |
| Auth | React 19 | 8082 | `/auth/signin`, `/auth/signup` |
| Dashboard | Vue 3 | 8083 | `/dashboard` |

Each app has its own webpack build, its own output folder and its own deploy path. None of them imports another at build time.

## Why it is interesting

**Independent deploys.** A remote is published as a `remoteEntry.js` plus hashed chunks under its own path. Rebuild and redeploy Marketing and the Container picks it up on the next page load; nothing else is rebuilt. The bundled nginx config serves `remoteEntry.js` with `no-cache` and the hashed chunks as immutable, which is what makes that safe.

**Runtime composition.** The Container's routes point at `import("marketing/mount")`, `import("auth/mount")` and `import("dashboard/mount")`. Module Federation resolves those in the browser, the first time each route is visited.

**Shared dependencies.** React, React DOM, React Router and Vue are shared singletons. Each app declares the version range it accepts in its own `package.json`; the runtime loads one compatible copy and every app uses it.

**Framework agnostic.** Every remote exposes the same contract: `mount(element, options)` returning `{ unmount, onHostNavigate }`. The Vue Dashboard mounts inside the React Container through that contract alone.

**Router synchronisation.** A React remote runs a memory router while hosted and a browser router when run on its own. Navigations are reported both ways, so links inside a remote update the address bar and the back button works across apps.

**Style isolation.** Every app uses CSS Modules through webpack's built-in CSS support. Class names carry the app's name as a prefix, so two apps can each define `.title` without colliding.

**Failure isolation.** If a remote cannot be loaded, the Container shows a notice in its place and the rest of the page keeps working. Visiting the route again retries the load.

The **explorer** panel in the bottom corner shows each remote's entry URL, whether it has loaded and how long that took (measured in the browser), and the shared packages the Container provides.

## Stack

- webpack 5 and its built-in [`ModuleFederationPlugin`](https://webpack.js.org/plugins/module-federation-plugin/)
- React 19 and React Router 7
- Vue 3.5 and Chart.js 4
- CSS Modules via webpack's native CSS support
- Babel 8, ESLint 10, `node:test`
- npm workspaces, Node.js 22.13 or later

## Getting started

```bash
git clone https://github.com/ZachariahAyers/modulefederation.git
cd modulefederation
npm install
```

Start all four dev servers, then open http://localhost:8080:

```bash
npm start
```

Or run one app on its own; each remote also works standalone on its own port:

```bash
npm start --workspace marketing    # http://localhost:8081
npm start --workspace auth         # http://localhost:8082
npm start --workspace dashboard    # http://localhost:8083
npm start --workspace container    # http://localhost:8080, needs the three remotes running
```

## Build, lint and test

```bash
npm run build                        # production build of every app into packages/*/dist
npm run build --workspace dashboard  # one app only
npm run lint
npm test
```

## Run the production build

The Dockerfile builds every app and serves them from one origin: the Container at `/` and each remote under `/marketing/`, `/auth/` and `/dashboard/`.

```bash
docker build -t modulefederation .
docker run --rm -p 8080:80 modulefederation
```

## Project structure

```
modulefederation/
├── packages/
│   ├── container/      Host: routing, header, explorer, loads the remotes
│   ├── marketing/      Remote (React): landing and how-it-works pages
│   ├── auth/           Remote (React): sign-in and sign-up forms
│   ├── dashboard/      Remote (Vue): sample dashboard with a Chart.js chart
│   ├── react-mount/    Shared source: the mount contract and router sync for React remotes
│   └── theme/          Shared source: design tokens and base styles
├── webpack/
│   └── create-config.js  One webpack config factory used by every app
├── scripts/start.js    Starts every dev server
├── Dockerfile
└── nginx.conf
```

`react-mount` and `theme` are workspace packages compiled into each app that uses them. They are shared source, not shared runtime modules, so each app still deploys on its own.

## License

Apache License 2.0. See [LICENSE](LICENSE).
