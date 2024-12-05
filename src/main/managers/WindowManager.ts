import { BrowserWindow, shell } from 'electron'
import { ElectronAdapter } from '../adapters/ElectronAdapter'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { PreviewManager, PreviewType } from './PreviewManager'

export class WindowManager {
  mainWindow: BrowserWindow | null = null
  private previewManager: PreviewManager | null = null

  constructor(private electronAdapter: ElectronAdapter) {}

  createMainWindow(): BrowserWindow {
    const window = new BrowserWindow({
      width: 1600,
      height: 1000,
      minWidth: 600,
      minHeight: 400,
      show: false,
      autoHideMenuBar: true,
      icon: join(__dirname, '../../build/icon'),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        nodeIntegration: true,
        contextIsolation: true,
        webSecurity: false,
        sandbox: false,
        zoomFactor: 1
      },
      ...(process.platform === 'darwin'
        ? {
            titleBarStyle: 'hidden',
            trafficLightPosition: { x: 16, y: 16 },
            vibrancy: 'fullscreen-ui'
          }
        : {
            backgroundMaterial: 'acrylic',
            frame: true
          })
    })

    this.setupMainWindowEvents(window)
    return window
  }

  private setupMainWindowEvents(window: BrowserWindow): void {
    window.on('ready-to-show', () => {
      window.show()
    })

    window.on('resize', () => {
      if (this.previewManager) {
        this.previewManager.handleWindowResize()
      }
    })

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      window.loadFile(join(__dirname, '../../out/renderer/index.html'))
    }

    this.electronAdapter.watchWindowShortcuts(window)
  }

  setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window
    this.previewManager = new PreviewManager(window)
  }

  togglePreviewWindow(type: PreviewType, show: boolean, rightPanelPercentage?: number): void {
    if (!this.previewManager || !this.mainWindow) return

    if (show) {
      this.previewManager.createPreview(type, rightPanelPercentage)
    } else {
      this.previewManager.removePreview(type)
    }
  }

  updatePreviewSize(type: PreviewType, rightPanelPercentage?: number): void {
    if (!this.previewManager || !this.mainWindow) return
    const preview = this.previewManager.getCurrentPreview(type)
    if (preview) {
      this.previewManager.updatePreviewBounds(type, preview, rightPanelPercentage)
    }
  }

  navigatePreview(type: PreviewType, direction: 'back' | 'forward'): void {
    const preview = this.previewManager?.getCurrentPreview(type)
    if (!preview) return

    if (direction === 'back') {
      preview.goBack()
    } else {
      preview.goForward()
    }
  }

  getCurrentUrl(type: PreviewType): string {
    const preview = this.previewManager?.getCurrentPreview(type)
    return preview?.getURL() ?? 'about:blank'
  }

  navigateToUrl(type: PreviewType, url: string): void {
    const preview = this.previewManager?.getCurrentPreview(type)
    preview?.loadURL(url)
  }

  getAllWindows(): BrowserWindow[] {
    return BrowserWindow.getAllWindows()
  }
}
