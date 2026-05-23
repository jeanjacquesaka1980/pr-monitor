import { app, ipcMain, shell, BrowserWindow } from 'electron'
import { checkAuth, getGithubBaseUrl, runGh } from './auth'
import { fetchPRs, fetchWorkflowRuns } from './github'
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

  ipcMain.handle('repos:list', async () => {
    try {
      const stdout = await runGh('repo', 'list', '--limit', '100', '--json', 'nameWithOwner', '--jq', '.[].nameWithOwner')
      return stdout.trim().split('\n').filter(Boolean)
    } catch {
      return []
    }
  })

  ipcMain.handle('workflows:fetch', async (_event, repos: string[]) => {
    return fetchWorkflowRuns(Array.isArray(repos) ? repos : [])
  })

  ipcMain.handle('app:check-update', async () => {
    try {
      const current = app.getVersion()
      // Check the tap cask directly — only show update when brew can actually install it
      const raw = await runGh('api', 'repos/jeanjacquesaka1980/homebrew-tap/contents/Casks/pr-monitor.rb', '--jq', '.content')
      const decoded = Buffer.from(raw.trim(), 'base64').toString('utf-8')
      const match = decoded.match(/version "([^"]+)"/)
      if (!match) return { hasUpdate: false, latestVersion: '' }
      const latest = match[1]
      return { hasUpdate: latest !== current, latestVersion: latest }
    } catch {
      return { hasUpdate: false, latestVersion: '' }
    }
  })
}
