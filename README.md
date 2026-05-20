# PR Monitor

![PR Monitor](screenshots/app.png)

A macOS menu bar app that shows all your open GitHub pull requests — authored and under review — with CI status and review decisions, updated every 60 seconds.

## Prerequisites

### 1. Install GitHub CLI

```bash
brew install gh
```

### 2. Authenticate with GitHub

```bash
gh auth login
```

Follow the prompts. When asked, choose **GitHub.com** and authenticate via browser. Once done, verify it worked:

```bash
gh auth status
```

You should see your username and a valid token.

## Running the app

```bash
cd /path/to/pr-monitor
npm install
npm run dev
```

The GitHub icon will appear in your menu bar. Click it to open the PR panel.

## Usage

| Element | Description |
|---|---|
| **Authored** | Open PRs you created |
| **Reviewing** | PRs where your review is requested |
| CI badge | `Passing` / `Failing` / `Pending` / `No CI` |
| Review badge | `Approved` / `Changes` / `Review required` |
| Link button | Opens the PR in your browser |
| Refresh button | Manual refresh (auto-refreshes every 60s) |
| Pin button | Keep the window always on top — clicking elsewhere won't close it |

Click anywhere outside the panel to dismiss it.

## Project structure

```
src/
├── main/          ← Electron main process
│   ├── index.ts   ← App entry, window setup
│   ├── tray.ts    ← Menu bar icon and popup positioning
│   ├── auth.ts    ← gh CLI integration
│   ├── github.ts  ← GitHub GraphQL API queries
│   ├── ipc-handlers.ts
│   └── preload.ts ← Secure bridge to renderer
├── renderer/      ← React UI (GitHub Primer design system)
│   ├── components/
│   └── hooks/
└── shared/
    └── types.ts   ← Shared TypeScript types
```

## Tech stack

- [Electron](https://www.electronjs.org/) — macOS app shell
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) — UI
- [GitHub Primer](https://primer.style/react/) — GitHub's own design system
- [Vite](https://vitejs.dev/) — renderer bundler
- [electron-builder](https://www.electron.build/) — .dmg packaging
- GitHub GraphQL API — PR and CI data (read-only)
- `gh` CLI — authentication (uses your existing session, nothing extra stored)
