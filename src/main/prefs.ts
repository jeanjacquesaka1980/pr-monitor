import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import type { Preferences } from '../shared/types'

const PREFS_PATH = path.join(app.getPath('userData'), 'preferences.json')
const LAUNCH_AGENT_LABEL = 'com.pr-monitor.app'
const LAUNCH_AGENT_PATH = path.join(
  os.homedir(),
  'Library/LaunchAgents',
  `${LAUNCH_AGENT_LABEL}.plist`,
)

const DEFAULTS: Preferences = {
  launchAtLogin: false,
  startMinimised: true,
  hiddenRepos: [],
  watchedUsers: [],
  showUnresolvedComments: false,
  showWorkflowJobs: false,
}

export function readPrefs(): Preferences {
  try {
    const raw = fs.readFileSync(PREFS_PATH, 'utf-8')
    return { ...DEFAULTS, ...JSON.parse(raw) as Preferences }
  } catch {
    return { ...DEFAULTS }
  }
}

// macOS 13+ SMAppService silently drops args from setLoginItemSettings,
// so we manage a LaunchAgent plist directly — it supports full argv.
function syncLaunchAgent(prefs: Preferences): void {
  const run = (cmd: string): void => {
    try { execSync(cmd, { stdio: 'ignore' }) } catch { /* ignore */ }
  }

  if (!prefs.launchAtLogin) {
    run(`launchctl unload "${LAUNCH_AGENT_PATH}"`)
    try { fs.unlinkSync(LAUNCH_AGENT_PATH) } catch { /* ignore */ }
    return
  }

  // --login-launch lets index.ts know this launch came from the login item
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LAUNCH_AGENT_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${process.execPath}</string>
    <string>${app.getAppPath()}</string>
    <string>--login-launch</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <false/>
</dict>
</plist>
`

  fs.mkdirSync(path.dirname(LAUNCH_AGENT_PATH), { recursive: true })
  fs.writeFileSync(LAUNCH_AGENT_PATH, plist)
  // Write only — macOS picks up the plist at next login automatically.
  // We do NOT launchctl load here to avoid double-launching a running app.
}

export function writePrefs(prefs: Preferences): void {
  fs.mkdirSync(path.dirname(PREFS_PATH), { recursive: true })
  fs.writeFileSync(PREFS_PATH, JSON.stringify(prefs, null, 2))
  syncLaunchAgent(prefs)
}

// True when launched via the LaunchAgent (login item) rather than manually
export function wasOpenedHidden(): boolean {
  return process.argv.includes('--login-launch') && readPrefs().startMinimised
}
