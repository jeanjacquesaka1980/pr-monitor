# Changelog

All notable changes to PR Monitor are documented here.

---

## [1.7.1] - 2026-05-21

### Security
- Added explicit `permissions: contents: read` to the typecheck workflow — removes reliance on permissive defaults and satisfies GitHub code scanning alert #3

---

## [1.7.0] - 2026-05-21

### Added
- **Homebrew distribution** — universal macOS `.zip` built with `electron-builder`; install via `brew install --cask jeanjacquesaka1980/tap/pr-monitor`
- **Release Please CI** — GitHub Actions workflow automates changelog and version bumps on merge to `master`
- Unresolved comments section added to the presentation/demo page with live prefs mock

### Fixed
- Unresolved comments column icons — replaced text labels with `HubotIcon` / `PersonIcon`, then swapped `HubotIcon` for `DependabotIcon` (square-headed robot) to better distinguish bots from humans
- Comments nav link missing from the presentation page

### Documentation
- Homebrew tap listed as the primary installation method in README
- Added Cmd+Space and Dock tips to README and presentation page

---

## [1.6.0] - 2026-05-21

### Added
- **Unresolved comments column** — opt-in preference that shows unresolved review thread counts per PR, split by bot and human authors (e.g. `bot 4 / hum 2`), displayed as a compact right-aligned column between the PR title and the open-in-browser link
- Bot detection uses GitHub's native `__typename` field (`Bot` vs `User`) on the comment author
- Toggle under Preferences → "Unresolved comments"; off by default

---

## [1.5.0] - 2026-05-21

### Added
- **Author filter** — a people icon in the header opens a dropdown to choose which colleagues appear in Others' PRs
- Others' PRs is now opt-in: no authors selected means the section stays empty
- Author selection persists in `preferences.json` and survives restarts
- Author filter stacks with the existing repo filter — both apply simultaneously

---

## [1.4.0] - 2026-05-21

### Added
- **Repo warning banners** — a yellow banner appears at the top of the list when a repo has 10 or more open PRs, and a red danger banner at 15 or more
- Both banners respect the active repo and author filters — hidden repos are excluded from counts

---

## [1.3.3] - 2026-05-20

### Changed
- Renamed sections: "Authored" is now **Your PRs**, "Reviewing" is now **Others' PRs**

### Fixed
- Filter dropdown toggle — clicking the filter icon again now correctly closes the dropdown (the outside-click handler and the button click were conflicting)

---

## [1.3.2] - 2026-05-20

### Fixed
- Duplicate check runs — deduplicates by fetching each run's `startedAt` timestamp and keeping only the most recent run per job name, regardless of the order GitHub returns them. Re-opened PRs and re-run jobs now show only the latest result

---

## [1.3.1] - 2026-05-20

### Fixed
- Duplicate check runs — when a PR is re-opened, GitHub returns both old and new run history; now deduplicates by job name keeping only the most recent run
- Others' PRs section — previously only showed PRs where your review was explicitly requested; now shows all open PRs from your discovered repos

---

## [1.3.0] - 2026-05-20

### Added
- **Repository filter** — filter icon in the header opens a dropdown with checkboxes per repo; filters both sections simultaneously; icon turns blue when active; selection persists in `preferences.json`

---

## [1.2.3] - 2026-05-20

### Changed
- Running CI jobs now show an animated spinner instead of a static stopwatch icon, matching the GitHub UI

---

## [1.2.2] - 2026-05-20

### Fixed
- PR and check run links now work on GitHub Enterprise — allowed host is detected dynamically from `gh api user` instead of being hardcoded to `github.com`; cached after the first call

---

## [1.2.1] - 2026-05-20

### Fixed
- Links now work reliably — Primer React v36's Tooltip component was intercepting clicks; replaced all Tooltip wrappers with native `title` attribute
- Tooltips no longer get stuck open after clicking

---

## [1.2.0] - 2026-05-20

### Added
- **Preferences panel** — gear icon opens a panel with Launch at login and Start minimised toggles; saved to `~/Library/Application Support/PR Monitor/preferences.json`
- **Persistent launch** — `npm run start` builds and launches detached from the terminal; closing the terminal no longer stops the app

### Fixed
- Refresh button and timestamp hidden when preferences panel is open
- Single-instance lock prevents double-launch if LaunchAgent fires while app is already running
- ToggleSwitch not responding to clicks in Primer React v36 (uses `onClick` not `onChange` in controlled mode)
- Login item launching bare Electron — now uses a LaunchAgent plist with full command arguments

---

## [1.1.1] - 2026-05-20

### Fixed
- Workflow separator line now renders after the jobs instead of below the workflow title

---

## [1.1.0] - 2026-05-20

### Added
- **Collapsible sections** — click the section header to collapse or expand
- **CI accordion** — click the chevron on any PR to see all check runs grouped by workflow, each with a status and direct link
- Larger author avatars (16px -> 20px)

### Fixed
- Corporate proxy support — GitHub API calls now route through the `gh` CLI instead of direct HTTP
- Node 22 compatibility — updated Vite, Electron, and plugin-react

---

## [1.0.0] - 2026-05-20

### Added
- Ghost icon in the macOS menu bar
- Your PRs and Others' PRs sections
- CI status badge and review decision badge per PR
- Auto-refresh every 60 seconds with manual refresh
- Pin/float mode — window stays on top when enabled
- Traffic light buttons — red hides the window without quitting
- Auth via existing `gh auth login` session — nothing extra to configure
