import { BaseHandler } from './BaseHandler'
import { WindowManager } from '../managers/WindowManager'
import { PreviewType } from '../managers/PreviewManager'

interface PreviewTogglePayload {
  show: boolean
  type: PreviewType
  sizes?: number[] | number
}

interface PreviewNavigatePayload {
  direction: 'back' | 'forward'
  type: PreviewType
}

export class WindowHandler extends BaseHandler {
  constructor(private windowManager: WindowManager) {
    super()
  }

  setup(): void {
    // Handle preview toggle with type
    this.on('toggle-preview', (_, payload: PreviewTogglePayload) => {
      const { show, type, sizes } = payload
      if (Array.isArray(sizes)) {
        this.windowManager.togglePreviewWindow(type, show, sizes[1])
      } else {
        this.windowManager.togglePreviewWindow(type, show, sizes)
      }
    })

    // Handle panel resize
    this.on('panel-resized', (_, payload: { type: PreviewType; sizes: number[] | number }) => {
      const { type, sizes } = payload
      if (Array.isArray(sizes)) {
        this.windowManager.updatePreviewSize(type, sizes[1])
      } else {
        this.windowManager.updatePreviewSize(type, sizes)
      }
    })

    // Handle preview resize
    this.on('resize-preview', (_, type: PreviewType) => {
      this.windowManager.updatePreviewSize(type)
    })

    // Handle preview navigation
    this.on('preview-navigate', (_, payload: PreviewNavigatePayload) => {
      const { direction, type } = payload
      this.windowManager.navigatePreview(type, direction)
    })

    // Handle URL navigation
    this.on('preview-navigate-to-url', (_, payload: { type: PreviewType; url: string }) => {
      const { type, url } = payload
      this.windowManager.navigateToUrl(type, url)
    })

    // Get current URL for specific preview type
    this.handle('get-preview-url', async (_, type: PreviewType) => {
      return this.windowManager.getCurrentUrl(type)
    })
  }
}
