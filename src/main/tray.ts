import path from 'path'
import { app, Tray, BrowserWindow, nativeImage, screen, Menu } from 'electron'

let tray: Tray | null = null

function playStartupAnimation(staticIcon: Electron.NativeImage): void {
  const totalFrames = 9
  const frames: Electron.NativeImage[] = []

  for (let i = 0; i < totalFrames; i++) {
    const framePath = path.join(__dirname, `../../assets/ghost-frame-${String(i).padStart(3, '0')}.png`)
    frames.push(nativeImage.createFromPath(framePath).resize({ width: 32, height: 32 }))
  }

  let current = 0
  const interval = setInterval(() => {
    if (!tray) { clearInterval(interval); return }
    tray.setImage(frames[current])
    current++
    if (current >= totalFrames) {
      clearInterval(interval)
      tray.setImage(staticIcon)
    }
  }, 100)
}

function getWindow(): BrowserWindow | null {
  return BrowserWindow.getAllWindows()[0] ?? null
}

function positionWindow(win: BrowserWindow): void {
  if (!tray) return
  const trayBounds = tray.getBounds()
  const winBounds = win.getBounds()
  const display = screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y })

  const x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2)
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  const clampedX = Math.min(
    Math.max(x, display.workArea.x),
    display.workArea.x + display.workArea.width - winBounds.width
  )

  win.setPosition(clampedX, y, false)
}

export function createTray(iconPath: string, onQuit: () => void): Tray {
  const icon = nativeImage.createFromPath(iconPath)
  const staticIcon = icon.resize({ width: 32, height: 32 })
  tray = new Tray(staticIcon)
  tray.setToolTip(`PR Monitor v${app.getVersion()}`)
  playStartupAnimation(staticIcon)

  tray.on('click', () => {
    const win = getWindow()
    if (!win) return

    if (win.isVisible()) {
      win.hide()
    } else {
      positionWindow(win)
      win.show()
      win.focus()
    }
  })

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open PR Monitor',
      click: () => {
        const win = getWindow()
        if (!win) return
        positionWindow(win)
        win.show()
        win.focus()
      },
    },
    { type: 'separator' },
    { label: 'Quit', click: onQuit },
  ])
  tray.setContextMenu(contextMenu)

  return tray
}
