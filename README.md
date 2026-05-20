# PR Monitor

![PR Monitor](screenshots/app.png)

A macOS menu bar app that shows all your open GitHub pull requests — authored and under review — with CI status, review decisions, and individual workflow check runs, updated every 60 seconds. Works with both GitHub.com and GitHub Enterprise.

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

Follow the prompts and authenticate via browser. Works with **GitHub.com** and **GitHub Enterprise** — the app detects your host automatically. Verify:

```bash
gh auth status
```

---

## Running the app

### Development mode (attached to terminal)

```bash
git clone https://github.com/jeanjacquesaka1980/pr-monitor.git
cd pr-monitor
npm install
npm run dev
```

The ghost icon appears in your menu bar. The app runs while the terminal is open. Closing the terminal stops the app.

### Persistent mode (detached from terminal)

```bash
npm run start
```

Builds the app and launches Electron detached from the terminal. You can close the terminal — the app keeps running until you quit it from the menu bar icon or the × button. Use this mode after setting "Launch at login" in preferences.

**To get the latest version on an existing clone:**

```bash
git pull
npm install  # only if dependencies changed
npm run start
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
| Filter button | Filter PRs by repository — highlighted blue when active |
| Refresh button | Manual refresh (auto-refreshes every 60s) |
| Pin button | Keep the window always on top — clicking elsewhere won't close it |
| Gear button | Open preferences panel |
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
  ⟳ lint         Running   ↗
```

Running jobs show an animated spinner. Each check run has a direct link to the run page on GitHub.

### Tray icon

- **Left-click** — open / hide the panel
- **Right-click** → **Quit** — fully stop the app

### Preferences

Click the gear icon in the header to open preferences:

| Setting | Description |
|---|---|
| **Launch at login** | Start PR Monitor automatically when you log in to macOS |
| **Start minimised** | Hide the window on launch — access the app via the menu bar icon |

Preferences are saved to `~/Library/Application Support/PR Monitor/preferences.json`.
The login item is managed via a LaunchAgent plist at `~/Library/LaunchAgents/com.pr-monitor.app.plist` — this ensures the correct app path and arguments are passed on login, which macOS's built-in login items API does not support reliably for non-packaged apps.

### Window controls

- **Red button** — hides the window (app keeps running in the tray)
- **Pin button** — window stays on top of all other apps

---

## Troubleshooting

### Force-killing the app

If the app is unresponsive, the tray icon is stuck, or Quit doesn't work, use `-9` (SIGKILL — instant, no chance to ignore):

```bash
pkill -9 -f Electron
```

To confirm nothing is left running:

```bash
pgrep -fl Electron
```

**Tray icon stays after kill** — this is normal macOS behaviour. The OS keeps the last frame visible until you interact with the menu bar. Click the ghost icon once and it disappears.

**Window stays after kill** — same cause. Click anywhere on the desktop or another app window to force macOS to redraw.

### Port 5173 still in use after dev mode crashes

```bash
lsof -ti:5173 | xargs kill -9
```

---

## Project structure

```
src/
├── main/                   ← Electron main process (Node.js)
│   ├── index.ts            ← App lifecycle, window setup
│   ├── tray.ts             ← Menu bar icon, popup positioning, context menu
│   ├── auth.ts             ← gh CLI discovery, GitHub host detection, API execution
│   ├── github.ts           ← GitHub GraphQL query + response normalisation
│   ├── ipc-handlers.ts     ← IPC bridge (main side)
│   ├── prefs.ts            ← Preferences read/write + LaunchAgent login item management
│   └── preload.ts          ← Secure context bridge to renderer
├── renderer/               ← React UI (GitHub Primer design system)
│   ├── components/
│   │   ├── Header.tsx      ← Title bar with refresh, pin, prefs, quit buttons
│   │   ├── PRSection.tsx   ← Collapsible AUTHORED / REVIEWING section
│   │   ├── PRCard.tsx      ← Single PR row with expand toggle
│   │   ├── CheckRunList.tsx← Workflow check runs grouped by workflow, spinning indicator for running jobs
│   │   ├── CIBadge.tsx     ← CI status badge
│   │   ├── ReviewBadge.tsx ← Review decision badge
│   │   ├── AuthGate.tsx    ← Shown when gh is not authenticated
│   │   ├── ErrorBanner.tsx ← Inline error display
│   │   └── Preferences.tsx ← Preferences panel (launch at login, start minimised)
│   └── hooks/
│       ├── useAuth.ts      ← Auth state via gh CLI
│       └── usePRs.ts       ← PR polling with 60s interval
└── shared/
    └── types.ts            ← TypeScript types shared between main and renderer
scripts/
└── start.js                ← Detached production launcher (npm run start)
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

### v1.3.1
- Fix: duplicate check runs no longer appear when a PR is re-opened — only the most recent run per job is shown
- Fix: REVIEWING section now shows all open PRs from your repos, not just those where your review is explicitly requested

### v1.3.0
- New: repository filter dropdown in the header — check/uncheck repos to show only the PRs you care about, applies to both AUTHORED and REVIEWING. Filter is highlighted in blue when active and persists across sessions.

### v1.2.3
- Running CI jobs now show a spinning indicator instead of a static stopwatch icon

### v1.2.2
- Fix: PR and check run links now work on GitHub Enterprise — host is detected dynamically from the `gh` CLI instead of being hardcoded to `github.com`

### v1.2.1
- Fix: links (open PR, view check run) now work on first click — Primer React's Tooltip was intercepting clicks to dismiss itself
- Fix: tooltips no longer get stuck visible after clicking a button

### v1.2.0
- Preferences panel (gear icon in header): launch at login, start minimised
- `npm run start` — builds and launches Electron detached from the terminal; closing the terminal no longer stops the app
- Preferences saved to `~/Library/Application Support/PR Monitor/preferences.json`

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
