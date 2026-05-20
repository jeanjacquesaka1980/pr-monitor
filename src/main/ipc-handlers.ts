import { ipcMain, shell, BrowserWindow } from 'electron'
import { checkAuth } from './auth'
import { fetchPRs } from './github'

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
    if (typeof url === 'string' && url.startsWith('https://github.com')) {
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
}
