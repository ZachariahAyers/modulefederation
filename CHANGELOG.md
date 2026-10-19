# Changelog

## Unreleased

### Added

- `PUBLIC_BASE` serves the whole site under one path, and a `demo` job in `ci.yml` publishes it to ayers.repair/opensource/modulefederation/ once the checks pass.

## 2.0.0 (2026-10-19)

Four independently deployed apps, React 19 and Vue 3, composed into one page at runtime with webpack 5 Module Federation.

### Added

- React 19, React Router 7, Vue 3.5, Chart.js 4 and webpack 5.112.
- Every app is TypeScript. The mount contract between host and remotes is a shared type (`@mfe/contract`), checked on both sides by `vue-tsc`.
- One webpack config factory (`webpack/create-config.ts`) for every app.
- Styling is CSS Modules on webpack's native CSS support, with per-app class prefixes and shared theme tokens with a dark mode.
- The two React remotes share one mount helper (`@mfe/react-mount`).
- The explorer panel shows load times measured in the browser and the versions actually shared.
- Marketing explains how the composition works. The dashboard's metrics are labelled sample data.
- Remotes unmount when the host leaves their route. Signing out lands on the overview. Sign-in and sign-up submit as real forms with required fields.
- A notice in place of a remote that fails to load; the rest of the page keeps working.
- A not-found page for paths no app owns.
- npm workspaces. Node 22.18 or later.
- The Docker image builds on Node 24. nginx serves `remoteEntry.js` uncached and hashed chunks as immutable.
- Tests that specify behaviour: Vitest with Testing Library across all apps and shared packages.
- ESLint 10 with typescript-eslint, Prettier, and a single `npm run check`.
- CI on GitHub Actions running the full check.
- Apache 2.0 license.
- `CLAUDE.md`, `docs/ARCHITECTURE.md` and a shared `.claude/settings.json` for working on the repo with Claude Code.
