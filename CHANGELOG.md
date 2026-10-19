# Changelog

## 2.0.0 (2026-10-19)

A rebuild of the same four-app demo on current tools. No new product features.

### Changed

- React 17 to 19, React Router 5 to 7, Vue 3.0 to 3.5, Chart.js 3 to 4, webpack 5.4 to 5.112.
- Every app is TypeScript. The mount contract between host and remotes is a shared type (`@mfe/contract`), checked on both sides by `vue-tsc`.
- One webpack config factory (`webpack/create-config.ts`) replaces twelve per-app configs.
- Styling is CSS Modules on webpack's native CSS support, with per-app class prefixes and shared theme tokens with a dark mode. Material UI, PrimeVue, PrimeFlex and PrimeIcons are gone.
- The two React remotes share one mount helper (`@mfe/react-mount`) instead of copies of the same router sync.
- The explorer panel shows load times measured in the browser and the versions actually shared, instead of random and hard-coded figures.
- Marketing's template pricing page is replaced by a page that explains how the composition works. The dashboard's invented "real-time metrics" are now labelled sample data.
- npm workspaces replace the mix of Yarn and npm. Node 22.18 or later.
- The Docker image builds on Node 24. nginx serves `remoteEntry.js` uncached and hashed chunks as immutable.
- LICENSE now carries the Apache 2.0 text the project always declared.

### Added

- Tests that specify behaviour: Vitest with Testing Library across all apps and shared packages.
- ESLint 10 with typescript-eslint, Prettier, and a single `npm run check`.
- CI on GitHub Actions running the full check.
- A notice in place of a remote that fails to load; the rest of the page keeps working.
- A not-found page for paths no app owns.
- `CLAUDE.md`, `docs/ARCHITECTURE.md` and a shared `.claude/settings.json` for working on the repo with Claude Code.

### Fixed

- Remotes are unmounted when the host leaves their route; they were never unmounted before.
- Signing out lands on the overview instead of being redirected to sign-in.
- Sign-in and sign-up submit as real forms with required fields.

### Removed

- The EC2 and ECR deploy workflow, the empty Dependabot config, IDE settings and `.DS_Store` files.
- The `--openssl-legacy-provider` workaround.

## 1.0.0 (2020-11-21 to 2025-10-05)

The original build, tagged `v1`: a React 17 host with React marketing and auth remotes and a Vue 3 dashboard remote on webpack 5.4 Module Federation, styled with Material UI 4 and PrimeVue 3, deployed to S3 and later to EC2 with Docker.
