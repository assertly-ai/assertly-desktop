import { WebContentsView, Menu, MenuItem, clipboard } from 'electron'

export interface PreviewWindowOptions {
  partition?: string
  persistentCookies?: boolean
  cache?: boolean
}

export interface PreviewBounds {
  x: number
  y: number
  width: number
  height: number
  scaleFactor?: number
}

export class PreviewWindow {
  private view: WebContentsView

  constructor(options: PreviewWindowOptions = {}) {
    this.view = new WebContentsView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        ...options
      }
    })
    this.view.setBorderRadius(6)
    this.setupContextMenu()
  }

  getView(): WebContentsView {
    return this.view
  }

  setBounds(bounds: PreviewBounds): void {
    this.view.setBounds(bounds)
    if (bounds.scaleFactor) {
      this.view.webContents.setZoomFactor(bounds.scaleFactor)
    }
  }

  loadURL(url: string): Promise<void> {
    return this.view.webContents.loadURL(url)
  }

  getURL(): string {
    return this.view.webContents.getURL()
  }

  goBack(): void {
    this.view.webContents.goBack()
  }

  goForward(): void {
    this.view.webContents.goForward()
  }

  private setupContextMenu(): void {
    this.view.webContents.on('context-menu', (_event, params) => {
      const menu = new Menu()

      if (params.selectionText) {
        menu.append(
          new MenuItem({
            label: 'Copy',
            click: () => clipboard.writeText(params.selectionText)
          })
        )
      }

      menu.append(new MenuItem({ label: 'Back', click: () => this.goBack() }))
      menu.append(new MenuItem({ label: 'Forward', click: () => this.goForward() }))
      menu.append(new MenuItem({ label: 'Reload', click: () => this.view.webContents.reload() }))

      menu.append(new MenuItem({ type: 'separator' }))

      menu.append(
        new MenuItem({
          label: 'Inspect Element',
          click: () => this.view.webContents.inspectElement(params.x, params.y)
        })
      )

      menu.popup()
    })
  }
}
