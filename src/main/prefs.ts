import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import type { Preferences } from '../shared/types'

const PREFS_PATH = path.join(app.getPath('userData'), 'preferences.json')

const DEFAULTS: Preferences = {
  launchAtLogin: false,
  startMinimised: true,
}

export function readPrefs(): Preferences {
  try {
    const raw = fs.readFileSync(PREFS_PATH, 'utf-8')
    return { ...DEFAULTS, ...JSON.parse(raw) as Preferences }
  } catch {
    return { ...DEFAULTS }
  }
}

export function writePrefs(prefs: Preferences): void {
  fs.mkdirSync(path.dirname(PREFS_PATH), { recursive: true })
  fs.writeFileSync(PREFS_PATH, JSON.stringify(prefs, null, 2))

  app.setLoginItemSettings({
    openAtLogin: prefs.launchAtLogin,
    openAsHidden: prefs.startMinimised,
  })
}

export function wasOpenedHidden(): boolean {
  return app.getLoginItemSettings().wasOpenedAsHidden
}
