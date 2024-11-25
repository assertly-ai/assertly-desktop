import { BrowserWindow, WebContentsView, Menu, MenuItem, clipboard, shell } from 'electron'
import { ElectronAdapter } from '../adapters/ElectronAdapter'
import icon from '../../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export class WindowManager {
  mainWindow: BrowserWindow | null = null
  previewWindow: WebContentsView | null = null
  private lastKnownPercentage: number = 80

  constructor(private electronAdapter: ElectronAdapter) {}

  createMainWindow(): BrowserWindow {
    const window = new BrowserWindow({
      width: 1600,
      height: 1000,
      minWidth: 600,
      minHeight: 400,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        zoomFactor: 1
      },
      // Use conditional properties based on the platform
      ...(process.platform === 'darwin'
        ? {
            titleBarStyle: 'hidden',
            trafficLightPosition: { x: 16, y: 16 },
            vibrancy: 'fullscreen-ui'
          }
        : {
            // For Windows and other platforms
            backgroundMaterial: 'acrylic',
            frame: true // This ensures the titlebar is visible
          })
    })

    window.on('ready-to-show', () => {
      window.show()
    })

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      window.loadFile(join(__dirname, '../../renderer/index.html'))
    }
    this.electronAdapter.watchWindowShortcuts(window)
    return window
  }

  setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window
  }

  // When creating the preview window, use the last known percentage
  createPreviewWindow(rightPanelPercentage?: number): WebContentsView {
    if (this.previewWindow) return this.previewWindow

    this.previewWindow = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    this.previewWindow.setBorderRadius(6)

    if (this.mainWindow) {
      this.mainWindow.contentView.addChildView(this.previewWindow)
    }

    this.setupContextMenu(this.previewWindow)

    // Use lastKnownPercentage when initializing
    this.updatePreviewWindowBounds(rightPanelPercentage || this.lastKnownPercentage)

    if (this.mainWindow) {
      this.mainWindow.on('resize', () => {
        // Pass the lastKnownPercentage during resize
        this.updatePreviewWindowBounds(rightPanelPercentage || this.lastKnownPercentage)
      })
    }

    this.previewWindow.webContents.once('did-finish-load', () => {
      if (this.mainWindow) {
        this.mainWindow.focus()
      }
    })

    this.previewWindow.webContents.loadURL('https://google.com')

    return this.previewWindow
  }

  removePreviewWindow(): void {
    if (this.previewWindow && this.mainWindow) {
      this.mainWindow.contentView.removeChildView(this.previewWindow)
      this.previewWindow = null
    }
  }

  togglePreviewWindow(show: boolean, rightPanelPercentage?: number): void {
    if (show) {
      this.createPreviewWindow(rightPanelPercentage)
    } else {
      this.removePreviewWindow()
    }
  }

  updatePreviewWindowBounds(rightPanelPercentage?: number): void {
    if (!this.previewWindow || !this.mainWindow) return

    if (Array.isArray(rightPanelPercentage)) {
      rightPanelPercentage = rightPanelPercentage[1]
    }

    if (rightPanelPercentage !== undefined) {
      this.lastKnownPercentage = rightPanelPercentage
    }

    const { width, height } = this.mainWindow.getBounds()
    const desiredWidth = 1512
    const desiredHeight = 982
    const MIN_LEFT_PANEL_WIDTH = 400
    const MAX_LEFT_PANEL_WIDTH = 800
    const HANDLE_WIDTH = 10
    const SIDE_NAV_WIDTH = 86

    const adjustedTotalWidth = width - SIDE_NAV_WIDTH

    const leftPanelWidth = Math.min(
      MAX_LEFT_PANEL_WIDTH,
      Math.max(
        MIN_LEFT_PANEL_WIDTH,
        Math.floor((adjustedTotalWidth * (100 - this.lastKnownPercentage)) / 100)
      )
    )

    const availablePreviewWidth = adjustedTotalWidth - leftPanelWidth - HANDLE_WIDTH
    const scaleFactor = Math.min(
      (availablePreviewWidth - 16) / desiredWidth,
      (height - 16) / desiredHeight
    )
    this.previewWindow.setBounds({
      x: SIDE_NAV_WIDTH + leftPanelWidth + HANDLE_WIDTH,
      y: 8 + 40,
      width: Math.max(0, availablePreviewWidth - 8),
      height: height - 16 - 40
    })

    this.previewWindow.webContents.setZoomFactor(scaleFactor)
  }

  getAllWindows(): BrowserWindow[] {
    return BrowserWindow.getAllWindows()
  }

  private setupContextMenu(view: WebContentsView): void {
    view.webContents.on('context-menu', (_event, params) => {
      const menu = new Menu()

      if (params.selectionText) {
        menu.append(
          new MenuItem({
            label: 'Copy',
            click: () => clipboard.writeText(params.selectionText)
          })
        )
      }

      // Navigation items
      menu.append(new MenuItem({ label: 'Back', click: () => view.webContents.goBack() }))
      menu.append(new MenuItem({ label: 'Forward', click: () => view.webContents.goForward() }))
      menu.append(new MenuItem({ label: 'Reload', click: () => view.webContents.reload() }))

      // Zoom controls
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(
        new MenuItem({
          label: 'Zoom In',
          click: () => view.webContents.setZoomLevel(view.webContents.getZoomLevel() + 0.5)
        })
      )
      menu.append(
        new MenuItem({
          label: 'Zoom Out',
          click: () => view.webContents.setZoomLevel(view.webContents.getZoomLevel() - 0.5)
        })
      )

      // Developer tools
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(
        new MenuItem({
          label: 'Inspect Element',
          click: () => view.webContents.inspectElement(params.x, params.y)
        })
      )
      menu.append(
        new MenuItem({
          label: 'Toggle Developer Tools',
          click: () => view.webContents.toggleDevTools()
        })
      )

      // View page source
      menu.append(
        new MenuItem({
          label: 'View Page Source',
          click: () =>
            view.webContents.executeJavaScript(
              `window.open('view-source:${view.webContents.getURL()}')`
            )
        })
      )

      menu.popup()
    })
  }
}
