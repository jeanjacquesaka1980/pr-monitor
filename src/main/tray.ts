import { app, Tray, BrowserWindow, nativeImage, screen, Menu } from 'electron'

let tray: Tray | null = null

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
  tray = new Tray(icon.resize({ width: 18, height: 18 }))
  tray.setToolTip(`PR Monitor v${app.getVersion()}`)

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
