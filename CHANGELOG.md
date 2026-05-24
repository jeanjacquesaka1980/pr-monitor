# Changelog

All notable changes to PR Monitor are documented here.

---

## [1.13.0](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.12.5...v1.13.0) (2026-05-24)


### Features

* add ghost pixel art animation to header and tray startup ([4b21fd6](https://github.com/jeanjacquesaka1980/pr-monitor/commit/4b21fd61f686ec1e5e676e58b6b08dd5c39bc2ea))
* update dock icon with new ghost and fix spinner layout shift ([3e2b87d](https://github.com/jeanjacquesaka1980/pr-monitor/commit/3e2b87d16b4c0439ed5e3f53baf0ef162d4de154))

## [1.12.5](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.12.4...v1.12.5) (2026-05-23)


### Bug Fixes

* use rm -rf instead of mv to Trash in troubleshooting docs ([768f748](https://github.com/jeanjacquesaka1980/pr-monitor/commit/768f748bd9f2a7ef29c3499b7eb96c074f39d415))

## [1.12.4](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.12.3...v1.12.4) (2026-05-23)


### Bug Fixes

* suppress listxattr error during brew upgrade ([d878363](https://github.com/jeanjacquesaka1980/pr-monitor/commit/d878363aa4fea6dfcd25b54f05efbc3f2f4a8622))
* suppress listxattr error during brew upgrade ([#37](https://github.com/jeanjacquesaka1980/pr-monitor/issues/37)) ([77a2d4c](https://github.com/jeanjacquesaka1980/pr-monitor/commit/77a2d4cc1d6f507e8e34b297a9152767b0bcdbc6))

## [1.12.3](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.12.2...v1.12.3) (2026-05-23)


### Bug Fixes

* check tap cask version for update notification instead of release tag ([2492f7b](https://github.com/jeanjacquesaka1980/pr-monitor/commit/2492f7b19ee955ef7459f76a419f978820b1b40c))

## [1.12.2](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.12.1...v1.12.2) (2026-05-23)


### Bug Fixes

* wait for process to die before upgrade proceeds ([ce2cbb8](https://github.com/jeanjacquesaka1980/pr-monitor/commit/ce2cbb8f10500e88ee4d78f14133cb25d184b0f6))

## [1.12.1](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.12.0...v1.12.1) (2026-05-23)


### Bug Fixes

* parse known errors into clean messages with detail lines ([bf3a4a4](https://github.com/jeanjacquesaka1980/pr-monitor/commit/bf3a4a415d855c143840feaac7e3de25aaaed0dd))
* refresh workflow jobs on manual refresh, use spinner for in-progress ([911e1c4](https://github.com/jeanjacquesaka1980/pr-monitor/commit/911e1c4148b8034a538b43b9b8943a7fc9f6d07d))

## [1.12.0](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.11.0...v1.12.0) (2026-05-22)


### Features

* improve login screen with guided steps and check again button ([779a342](https://github.com/jeanjacquesaka1980/pr-monitor/commit/779a342c2027e5a15c078540855ead82937acaf2))
* improve login screen with guided steps and check again button ([#29](https://github.com/jeanjacquesaka1980/pr-monitor/issues/29)) ([3e5c329](https://github.com/jeanjacquesaka1980/pr-monitor/commit/3e5c3293a1477773a31d33cc5395dd690a07a625))

## [1.11.0](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.10.0...v1.11.0) (2026-05-22)


### Features

* add workflow jobs section ([fe0b2b0](https://github.com/jeanjacquesaka1980/pr-monitor/commit/fe0b2b06f705966a8cce0c3a92f04ba588293186))


### Bug Fixes

* hide Jobs section when no runs are available ([4e3f0f7](https://github.com/jeanjacquesaka1980/pr-monitor/commit/4e3f0f7562216d5226faa580eb05c628d190ebe5))
* hide Others PRs section when no collaborators are selected ([e9205ae](https://github.com/jeanjacquesaka1980/pr-monitor/commit/e9205aea5a996f4054f09d8037d820783e7306f3))

## [1.10.0](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.9.0...v1.10.0) (2026-05-22)


### Features

* show all user repos in filter, redesign as full-width inline panel ([9ab8209](https://github.com/jeanjacquesaka1980/pr-monitor/commit/9ab82095da1e8bc4bfa04cd57484ebecbb106011))
* show all user repos in filter, redesign as full-width inline panel ([#24](https://github.com/jeanjacquesaka1980/pr-monitor/issues/24)) ([f09ea6f](https://github.com/jeanjacquesaka1980/pr-monitor/commit/f09ea6f1f3ab635a00eacc25377aa05b51d47ef1))

## [1.9.0](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.8.1...v1.9.0) (2026-05-22)


### Features

* show update notification banner when a newer version is available ([526a63e](https://github.com/jeanjacquesaka1980/pr-monitor/commit/526a63e71ec20aff1c6f129f2a8162d2f1468dd4))
* show update notification banner when a newer version is available ([#22](https://github.com/jeanjacquesaka1980/pr-monitor/issues/22)) ([4ac387c](https://github.com/jeanjacquesaka1980/pr-monitor/commit/4ac387c2cd914b14b267b87052a55585efc42dab))

## [1.8.1](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.8.0...v1.8.1) (2026-05-22)


### Bug Fixes

* align icon and text in repo warning banners, add bottom padding ([2f1671e](https://github.com/jeanjacquesaka1980/pr-monitor/commit/2f1671eaad1c8779e7c42ce6c6d752544a0458f2))
* align icon and text in repo warning banners, add bottom padding ([#19](https://github.com/jeanjacquesaka1980/pr-monitor/issues/19)) ([0156b98](https://github.com/jeanjacquesaka1980/pr-monitor/commit/0156b98af908e4fb3b518ac6cfa2534523abc431))

## [1.8.0](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.7.3...v1.8.0) (2026-05-21)


### Features

* show app version in preferences panel footer ([ed7dee5](https://github.com/jeanjacquesaka1980/pr-monitor/commit/ed7dee5aa3b8ba9ae05547868e3780554e1263bf))
* show app version in preferences panel footer ([#17](https://github.com/jeanjacquesaka1980/pr-monitor/issues/17)) ([166805a](https://github.com/jeanjacquesaka1980/pr-monitor/commit/166805a8d20dc9269421b3aede31b7b5e7982a02))

## [1.7.3](https://github.com/jeanjacquesaka1980/pr-monitor/compare/v1.7.2...v1.7.3) (2026-05-21)


### Bug Fixes

* add --clobber to gh release upload to handle re-runs cleanly ([3f2ac51](https://github.com/jeanjacquesaka1980/pr-monitor/commit/3f2ac519c851d6a8432c86f86e0279a41d24d817))
* disable electron-builder auto-publish in CI with --publish never ([91e0b06](https://github.com/jeanjacquesaka1980/pr-monitor/commit/91e0b068a929b4b4c2c598cbf9c7f807e899c0c1))
* replace heredoc with sed in brew-release workflow to fix YAML parse error ([c5f7946](https://github.com/jeanjacquesaka1980/pr-monitor/commit/c5f79463424133fdfb9704e8bf6d50b8699b0fbb))

## [1.7.2] - 2026-05-21

### Added
- Tray tooltip now shows the running version (e.g. "PR Monitor v1.7.2")

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
