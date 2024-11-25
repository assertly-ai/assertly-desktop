import { BaseHandler } from './BaseHandler'
import { BrowserManager } from '../managers/BrowserManager'

export class BrowserHandler extends BaseHandler {
  constructor(private browserManager: BrowserManager) {
    super()
  }

  setup(): void {
    this.handle('execute-playwright-code', async (_, code: string, blockId: number) => {
      try {
        const result = await this.browserManager.executePlaywrightCode(code, blockId)
        return { success: true, data: result }
      } catch (error: unknown) {
        return { success: false, error: error }
      }
    })
  }
}
