# BearMiniPainting

A minimalist miniature painting tracker. Organize your painting projects, break them down into units, and track each painting step — from assembly to varnish — so you always know where you stand.

BearMiniPainting is built for miniature painters of any kind: Warhammer armies, Warmachine warbands, board-game figures, dioramas, or any hobby project that goes through a sequence of finishing steps.

## Features

- **Projects** — create projects with a unique code to organize your painting sessions.
- **Units** — break a project down into units, each with its own default painting steps (Assembly, Primer, Basecoat, Effects, Base, Varnish).
- **Custom todos** — add your own painting steps to any unit.
- **Progress tracking** — toggle steps as done and see live completion rates for units and projects.
- **Reorder steps** — drag & drop to arrange your painting steps in the order that fits your workflow.
- **Offline-first** — all data is stored locally in your browser (`localStorage`), no account or backend required.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) build tool
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [@dnd-kit](https://dndkit.com/) for drag & drop
- [Jest](https://jestjs.io/) for testing
- Hexagonal (Clean) architecture: Core → Adapters → UI

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)

### Install & run

```bash
npm install      # install dependencies
npm run dev      # start the dev server (Vite)
```

### Available scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the local dev server           |
| `npm run build`      | Build the app for production (`dist`)|
| `npm test`           | Run the Jest test suite              |
| `npm run test:watch` | Run tests in watch mode              |
| `npm run typecheck`  | Type-check with `tsc --noEmit`       |

## Deployment

BearMiniPainting is deployed to GitHub Pages via GitHub Actions (manual trigger).

- **Live app**: https://guillaumecasbas.github.io/bearminipainting/
- **Workflow**: `.github/workflows/deploy.yml`

To deploy manually: open the **Actions** tab → "Deploy to GitHub Pages" → **Run workflow**.

> Note: GitHub Pages must be enabled in the repository settings with **Source = GitHub Actions**.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the list of changes per release.

## License

ISC
