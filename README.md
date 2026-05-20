# PR Monitor

![PR Monitor](screenshots/app.png)

A macOS menu bar app that shows all your open GitHub pull requests — authored and under review — with CI status, review decisions, and individual workflow check runs, updated every 60 seconds.

---

## Prerequisites

### 1. Node.js 20 or 22

```bash
brew install node@22
```

### 2. GitHub CLI

```bash
brew install gh
```

### 3. Authenticate with GitHub

```bash
gh auth login
```

Follow the prompts — choose **GitHub.com** and authenticate via browser. Verify:

```bash
gh auth status
```

---

## Running the app

```bash
git clone https://github.com/jeanjacquesaka1980/pr-monitor.git
cd pr-monitor
npm install
npm run dev
```

The ghost icon will appear in your menu bar. Click it to open the PR panel.

**To get the latest version on an existing clone:**

```bash
git pull
npm install  # only if dependencies changed
npm run dev
```

---

## Usage

### PR panel

| Element | Description |
|---|---|
| **AUTHORED** / **REVIEWING** | Click the section header to collapse or expand |
| Chevron `›` on a PR | Expand to see all CI workflow check runs |
| CI badge | `Passing` / `Failing` / `Pending` / `No CI` |
| Review badge | `Approved` / `Changes` / `Review required` |
| `↗` button | Opens the PR in your browser |
| Refresh button | Manual refresh (auto-refreshes every 60s) |
| Pin button | Keep the window always on top — clicking elsewhere won't close it |
| `×` button | Fully quit the app |

Click anywhere outside the panel to dismiss it (unless pinned).

### Workflow check runs

Click the chevron next to any PR to expand its CI details. Checks are grouped by workflow:

```
CI
  ✓ build        Passed
  ✗ test         Failed    ↗
──────────────────────────────
Deploy
  ● lint         Running
```

Each check run has a direct link to the run page on GitHub.

### Tray icon

- **Left-click** — open / hide the panel
- **Right-click** → **Quit** — fully stop the app

### Window controls

- **Red button** — hides the window (app keeps running in the tray)
- **Pin button** — window stays on top of all other apps

---

## Project structure

```
src/
├── main/                   ← Electron main process (Node.js)
│   ├── index.ts            ← App lifecycle, window setup
│   ├── tray.ts             ← Menu bar icon, popup positioning, context menu
│   ├── auth.ts             ← gh CLI discovery and execution
│   ├── github.ts           ← GitHub GraphQL query + response normalisation
│   ├── ipc-handlers.ts     ← IPC bridge (main side)
│   └── preload.ts          ← Secure context bridge to renderer
├── renderer/               ← React UI (GitHub Primer design system)
│   ├── components/
│   │   ├── Header.tsx      ← Title bar with refresh, pin, quit buttons
│   │   ├── PRSection.tsx   ← Collapsible AUTHORED / REVIEWING section
│   │   ├── PRCard.tsx      ← Single PR row with expand toggle
│   │   ├── CheckRunList.tsx← Workflow check runs grouped by workflow
│   │   ├── CIBadge.tsx     ← CI status badge
│   │   ├── ReviewBadge.tsx ← Review decision badge
│   │   ├── AuthGate.tsx    ← Shown when gh is not authenticated
│   │   └── ErrorBanner.tsx ← Inline error display
│   └── hooks/
│       ├── useAuth.ts      ← Auth state via gh CLI
│       └── usePRs.ts       ← PR polling with 60s interval
└── shared/
    └── types.ts            ← TypeScript types shared between main and renderer
```

---

## Tech stack

| | |
|---|---|
| [Electron 39](https://www.electronjs.org/) | macOS app shell, tray, window management |
| [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) | UI |
| [GitHub Primer](https://primer.style/react/) | GitHub's own design system |
| [Vite 8](https://vitejs.dev/) | Renderer bundler |
| GitHub GraphQL API | PR list, CI rollup, individual check runs (read-only) |
| `gh` CLI | Auth + API calls — respects corporate proxies automatically |

---

## Changelog

### v1.1.1
- Fix: workflow separator line now renders after jobs, not below the title

### v1.1.0
- Collapsible AUTHORED / REVIEWING sections
- Expandable CI check runs per PR, grouped by workflow with status icons
- Corporate proxy support — all API calls route through `gh` CLI
- Avatar size improved
- Upgraded to Node 22, Vite 8, Electron 39

### v1.0.0
- Initial release
- Ghost menu bar icon
- Authored and reviewing PR sections
- CI status and review decision badges
- Auto-refresh every 60s, manual refresh
- Pin/float mode
- Quit via tray right-click or × button
- Auth via `gh auth login`
