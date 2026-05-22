import { app, ipcMain, shell, BrowserWindow } from 'electron'
import { checkAuth, getGithubBaseUrl, runGh } from './auth'
import { fetchPRs } from './github'
import { readPrefs, writePrefs } from './prefs'
import type { Preferences } from '../shared/types'

let floating = false

export function isFloating(): boolean {
  return floating
}

export function registerIpcHandlers(win: BrowserWindow, onQuit: () => void): void {
  ipcMain.handle('auth:check', async () => {
    return checkAuth()
  })

  ipcMain.handle('prs:fetch', async () => {
    return fetchPRs()
  })

  ipcMain.handle('shell:openExternal', async (_event, url: string) => {
    if (typeof url !== 'string') return
    const baseUrl = await getGithubBaseUrl()
    if (url.startsWith(baseUrl)) {
      await shell.openExternal(url)
    }
  })

  ipcMain.handle('window:setFloat', (_event, enabled: boolean) => {
    floating = enabled
    win.setAlwaysOnTop(enabled, 'floating')
  })

  ipcMain.handle('app:quit', () => {
    onQuit()
  })

  ipcMain.handle('prefs:get', () => {
    return readPrefs()
  })

  ipcMain.handle('prefs:set', (_event, prefs: Preferences) => {
    writePrefs(prefs)
  })

  ipcMain.handle('app:version', () => app.getVersion())

  ipcMain.handle('app:check-update', async () => {
    try {
      const current = app.getVersion()
      const raw = await runGh('release', 'view', '--repo', 'jeanjacquesaka1980/pr-monitor', '--json', 'tagName', '--jq', '.tagName')
      const latest = raw.trim().replace(/^v/, '')
      return { hasUpdate: latest !== current, latestVersion: latest }
    } catch {
      return { hasUpdate: false, latestVersion: '' }
    }
  })
}
