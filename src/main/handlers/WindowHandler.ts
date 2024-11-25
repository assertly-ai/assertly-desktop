import { BaseHandler } from './BaseHandler'
import { WindowManager } from '../managers/WindowManager'

export class WindowHandler extends BaseHandler {
  constructor(private windowManager: WindowManager) {
    super()
  }

  setup(): void {
    this.on('toggle-preview', (_, show: boolean, sizes: number[] | number) => {
      if (Array.isArray(sizes)) {
        this.windowManager.togglePreviewWindow(show, sizes[1])
      } else {
        this.windowManager.togglePreviewWindow(show, sizes)
      }
    })

    this.on('panel-resized', (_, sizes: number[] | number) => {
      if (Array.isArray(sizes)) {
        this.windowManager.updatePreviewWindowBounds(sizes[1])
      } else {
        this.windowManager.updatePreviewWindowBounds(sizes)
      }
    })

    this.on('resize-preview', () => {
      this.windowManager.updatePreviewWindowBounds()
    })
  }
}
