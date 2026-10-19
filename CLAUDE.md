# Module Federation demo

Four webpack 5 apps composed in the browser at runtime: `container` (React host) loads `marketing` and `auth` (React remotes) and `dashboard` (Vue remote). Read `docs/ARCHITECTURE.md` before changing how remotes load, mount or share packages.

## Commands

- `npm install`: needs Node 22.18 or later (CI uses 24).
- `npm run check`: format check, lint, typecheck, tests, then a production build of every app. Run it before calling work done.
- `npm test`: every test (Vitest, jsdom). One file: `npx vitest run packages/auth/src/components/AuthForm.test.tsx`.
- `npm run typecheck`: `vue-tsc` over all packages, `.vue` files included.
- `npm run lint`, `npm run format` (Prettier writes), `npm run format:check`.
- `npm run build`: every app into `packages/*/dist`. One app: `npm run build --workspace auth`.
- `npm start`: all four dev servers on 8080 to 8083. It never exits; do not use it to verify a change.

## Workspace

- `packages/container`: host. Routes, header, explorer panel, and `RemoteApp`, which loads and mounts a remote.
- `packages/marketing`, `packages/auth`: React remotes. Each exposes `./mount`.
- `packages/dashboard`: Vue remote. Exposes `./mount`.
- `packages/contract`: types only. The `Mount` contract every remote implements and the host calls.
- `packages/react-mount`: `createMount` and router sync, shared source for the React remotes.
- `packages/theme`: design tokens and the global `.button` and `.card` classes.
- `webpack/create-config.ts`: the one webpack config. Each app's `webpack.config.js` calls it.

## Conventions

- An app never imports another app's code. Code two apps need goes in `contract`, `react-mount` or `theme`.
- Every remote exports `mount` typed with `Mount` from `@mfe/contract`. The host's declarations for `marketing/mount`, `auth/mount` and `dashboard/mount` are in `packages/container/src/env.d.ts`; change the contract first, then both sides.
- Every entry in an app's `dependencies` is shared through Module Federation. Packages that must have one copy at runtime are listed in `SINGLETONS` in `create-config.ts`.
- Import `RouterProvider` from `react-router`, never `react-router/dom`: the dom entry carries its own router contexts, which split from the shared copy.
- Styles: one `.module.css` per component, imported as `import * as styles`. Colours, radii and fonts come from the theme's custom properties. No inline styles.
- Webpack config files run directly on Node, so imports of `.ts` files there need the `.ts` extension. App source uses extensionless imports.
- Tests sit next to the code as `*.test.ts` or `*.test.tsx` and find elements by role or label, the way a user would.
- Commits: conventional commits with a lower-case subject.

## Done means

`npm run check` passes, and every behaviour you changed has a test.
