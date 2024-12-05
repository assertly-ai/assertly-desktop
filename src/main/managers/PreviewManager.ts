import { BrowserWindow } from 'electron'
import { PreviewWindow, PreviewBounds } from '../windows/PreviewWindow'

export enum PreviewType {
  EXPLORATORY = 'exploratory',
  SCRIPTING = 'scripting'
}

export class PreviewManager {
  private exploratoryPreview: PreviewWindow | null = null
  private scriptingPreview: PreviewWindow | null = null
  private currentType: PreviewType | null = null
  private lastKnownPercentage: number = 80

  constructor(private mainWindow: BrowserWindow) {}

  createPreview(type: PreviewType, rightPanelPercentage?: number): PreviewWindow {
    // Return existing preview if already created
    if (type === PreviewType.EXPLORATORY && this.exploratoryPreview) {
      return this.exploratoryPreview
    }
    if (type === PreviewType.SCRIPTING && this.scriptingPreview) {
      return this.scriptingPreview
    }

    const preview = new PreviewWindow(
      type === PreviewType.SCRIPTING
        ? {
            partition: 'scripting',
            persistentCookies: false,
            cache: false
          }
        : undefined
    )

    this.mainWindow.contentView.addChildView(preview.getView())
    this.setupNavigationListeners(preview)
    this.updatePreviewBounds(type, preview, rightPanelPercentage)

    if (type === PreviewType.EXPLORATORY) {
      this.exploratoryPreview = preview
      preview.loadURL('https://google.com')
    } else {
      this.scriptingPreview = preview
      preview.loadURL('about:blank')
    }

    this.currentType = type
    return preview
  }

  private setupNavigationListeners(preview: PreviewWindow): void {
    const view = preview.getView()
    view.webContents.on('did-navigate', () => {
      this.mainWindow.webContents.send('preview-url-changed', preview.getURL())
    })

    view.webContents.on('did-navigate-in-page', () => {
      this.mainWindow.webContents.send('preview-url-changed', preview.getURL())
    })
  }

  private calculateBounds(type: PreviewType, rightPanelPercentage?: number): PreviewBounds {
    const { width, height } = this.mainWindow.getBounds()
    const SIDE_NAV_WIDTH = 86

    if (type === PreviewType.EXPLORATORY) {
      return {
        x: SIDE_NAV_WIDTH + 400,
        y: 8 + 42,
        width: width - SIDE_NAV_WIDTH - 8 - 400,
        height: height - 16 - 42
      }
    }

    // Scripting preview bounds calculation
    const desiredWidth = 1512
    const desiredHeight = 982
    const MIN_LEFT_PANEL_WIDTH = 400
    const MAX_LEFT_PANEL_WIDTH = 800
    const HANDLE_WIDTH = 10

    if (rightPanelPercentage !== undefined) {
      this.lastKnownPercentage = rightPanelPercentage
    }

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

    return {
      x: SIDE_NAV_WIDTH + leftPanelWidth + HANDLE_WIDTH,
      y: 8 + 40,
      width: Math.max(0, availablePreviewWidth - 8),
      height: height - 16 - 40,
      scaleFactor
    }
  }

  updatePreviewBounds(
    type: PreviewType,
    preview: PreviewWindow,
    rightPanelPercentage?: number
  ): void {
    const bounds = this.calculateBounds(type, rightPanelPercentage)
    preview.setBounds(bounds)
  }

  removePreview(type: PreviewType): void {
    const preview =
      type === PreviewType.EXPLORATORY ? this.exploratoryPreview : this.scriptingPreview

    if (preview) {
      this.mainWindow.contentView.removeChildView(preview.getView())
      if (type === PreviewType.EXPLORATORY) {
        this.exploratoryPreview = null
      } else {
        this.scriptingPreview = null
      }
    }

    if (this.currentType === type) {
      this.currentType = null
    }
  }

  getCurrentPreview(type: PreviewType): PreviewWindow | null {
    return type === PreviewType.EXPLORATORY ? this.exploratoryPreview : this.scriptingPreview
  }

  handleWindowResize(): void {
    if (this.currentType && this.exploratoryPreview) {
      this.updatePreviewBounds(
        PreviewType.EXPLORATORY,
        this.exploratoryPreview,
        this.lastKnownPercentage
      )
    }
    if (this.currentType && this.scriptingPreview) {
      this.updatePreviewBounds(
        PreviewType.SCRIPTING,
        this.scriptingPreview,
        this.lastKnownPercentage
      )
    }
  }
}
