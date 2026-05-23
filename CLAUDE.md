# CLAUDE.md - PR Monitor

Electron + React menu bar app for macOS. Distributed via Homebrew tap.

- **Path**: `/Users/nineteeneighty/Documents2/workspaces/pr-monitor`
- **Repo**: https://github.com/jeanjacquesaka1980/pr-monitor
- **Tap**: https://github.com/jeanjacquesaka1980/homebrew-tap

## Stack
- Electron + React + TypeScript + Vite
- Primer React (v36) for UI components
- `gh` CLI for all GitHub API calls (proxy-safe)
- IPC pattern: `ipcMain.handle` -> `contextBridge.exposeInMainWorld` -> `window.api.*`

## Conventional commits
- `feat:` - new feature - triggers minor bump (1.x.0)
- `fix:` - bug fix - triggers patch bump (1.0.x)
- `chore:` / `ci:` / `docs:` / `refactor:` - no release triggered
- Breaking change: add `!` after type or `BREAKING CHANGE:` in body

## Release workflow (fully automated)
Release Please watches `feat:` and `fix:` commits and opens a release PR automatically.
When that PR is merged, `brew-release.yml` builds the zip, uploads it, and writes the full cask to the tap.
No manual version bumping, tagging, or tap commits needed.

## Cask source of truth
`.github/workflows/brew-release.yml` writes the full cask from scratch on every release.
Never manually commit to the tap -- CI owns it.

## Build
- `npm run dist` -- runs `predist` (tsc + vite build) then electron-builder universal macOS zip
- Output: `release/PR Monitor-X.Y.Z-universal-mac.zip`

## Code rules
- Read the file before modifying - never edit blind
- Simplest working solution - no over-engineering
- No abstractions for single-use operations
- No speculative features
- No em dashes, smart quotes, or decorative Unicode - plain hyphens and straight quotes only
- No inline prose, no boilerplate unless asked
- State the bug, show the fix, stop - no suggestions beyond scope
- Never speculate about a bug without reading the code first

## Presentation rule
When a feature or improvement is done, always update `index.html` (the presentation page) in the same branch and same commit. Never do it separately.

## Branching - always do this before creating a new branch
1. Run `git branch -a` to check for open/existing branches
2. Run `git log origin/master..HEAD` to check if master is up to date
3. Always prompt the user to pull master and give the exact command: `git checkout master && git pull origin master`
4. Each fix/feature gets its own new branch - never reuse a merged one

## Before any code change - always do this first
1. Check full project state: current branch, staged/unstaged changes, commits not yet pushed, open branches
2. Give the user a clear status summary
3. Present a short concise draft of what you plan to do and wait for approval before touching any code or committing

## Session rules - non-negotiable
- **Never commit without showing a draft to the user and getting explicit approval first**
- **Always give explicit push commands** after every commit
- **Always remind the user to pull master first** - the local repo is frequently out of sync
- **When a side instruction is given mid-task**, finish acknowledging it and flag what the pending next step is
- **Never modify the local tap file** (`/usr/local/Homebrew/Library/Taps/...`) without explicit permission - testing must happen through a real release cycle (old version -> new release -> brew upgrade)

## GitHub - never do autonomously
- Never push, create a PR, or merge a PR - commit only, user handles all GitHub operations
- Never change repo/org settings, branch protection rules, Actions permissions, or secrets - instruct the user instead
