# Module Federation

[![CI](https://github.com/ZachariahAyers/modulefederation/actions/workflows/ci.yml/badge.svg)](https://github.com/ZachariahAyers/modulefederation/actions/workflows/ci.yml)

Four independently built web apps, three in React and one in Vue, composed into a single page at runtime with webpack Module Federation.

Live demo: [ayers.repair/opensource/modulefederation](https://ayers.repair/opensource/modulefederation/).

## Features

- A host app that owns routing and the page chrome and loads three remote apps on demand
- Each app builds and deploys on its own, and also runs standalone
- React and Vue apps share one page through a single typed mount contract
- A notice appears in place of a remote that fails to load, and the rest of the page keeps working
- An explorer panel showing each remote's URL, load state and load time

## Tech stack

TypeScript, webpack 5 Module Federation, React, Vue, Chart.js, Vitest, Docker.

## Getting started

Requires Node.js 22.18 or newer.

```bash
git clone https://github.com/ZachariahAyers/modulefederation.git
cd modulefederation
npm install
npm start
```

Open http://localhost:8080. This starts all four dev servers (ports 8080 to 8083).

## Development

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run check          # all of the above, as CI runs it
```

To serve the production build from one origin:

```bash
docker build -t modulefederation .
docker run --rm -p 8080:80 modulefederation
```

How it is put together: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License

Apache License 2.0. See [LICENSE](LICENSE).

---

Built by [Zachariah Ayers](https://ayers.repair).
