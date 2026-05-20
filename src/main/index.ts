import { app, BrowserWindow } from 'electron'
import path from 'path'
import { createTray } from './tray'
import { registerIpcHandlers, isFloating } from './ipc-handlers'
import { readPrefs, wasOpenedHidden } from './prefs'

const isDev = process.env.NODE_ENV === 'development'

let quitting = false

export function quit(): void {
  quitting = true
  app.quit()
}

app.setName('PR Monitor')

if (process.platform === 'darwin') {
  app.dock?.hide()
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 480,
    height: 620,
    minWidth: 380,
    minHeight: 400,
    show: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 12 },
    resizable: true,
    fullscreenable: false,
    skipTaskbar: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // Red close button hides; only a real quit() call exits
  win.on('close', (e) => {
    if (!quitting) {
      e.preventDefault()
      win.hide()
    }
  })

  win.on('blur', () => {
    if (!isFloating() && !win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })

  return win
}

app.whenReady().then(() => {
  // Remove legacy setLoginItemSettings entry — we now use a LaunchAgent plist
  app.setLoginItemSettings({ openAtLogin: false })

  const win = createWindow()
  registerIpcHandlers(win, quit)

  const iconPath = path.join(__dirname, '../../assets/tray-icon.png')
  createTray(iconPath, quit)

  // Show window on launch unless startMinimised is on or macOS opened it hidden
  const prefs = readPrefs()
  if (!prefs.startMinimised && !wasOpenedHidden()) {
    const tray = BrowserWindow.getAllWindows()[0]
    tray?.show()
  }
})

app.on('window-all-closed', () => {
  // Prevent default quit — app lives in the tray
})
