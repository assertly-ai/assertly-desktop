import { AgentManager } from '../managers/AgentManager'
import { BrowserManager } from '../managers/BrowserManager'
import { WindowManager } from '../managers/WindowManager'
import { StorageManager } from '../managers/StorageManager'
import { AgentHandler } from './AgentHandler'
import { BaseHandler } from './BaseHandler'
import { BrowserHandler } from './BrowserHandler'
import { StorageHandler } from './StorageHandler'
import { WindowHandler } from './WindowHandler'

export class IpcHandler {
  private handlers: BaseHandler[]

  constructor(
    windowManager: WindowManager,
    browserManager: BrowserManager,
    storageManager: StorageManager,
    agentManager: AgentManager
  ) {
    this.handlers = [
      new AgentHandler(agentManager),
      new WindowHandler(windowManager),
      new BrowserHandler(browserManager),
      new StorageHandler(storageManager)
    ]
  }

  setupHandlers(): void {
    this.handlers.forEach((handler) => handler.setup())
  }
}
