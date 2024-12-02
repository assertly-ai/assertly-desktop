import { BrowserManager } from '../managers/BrowserManager'
import { WindowManager } from '../managers/WindowManager'
import { StorageManager } from '../managers/StorageManager'
import { BaseHandler } from './BaseHandler'
import { BrowserHandler } from './BrowserHandler'
import { StorageHandler } from './StorageHandler'
import { WindowHandler } from './WindowHandler'
import { ExploratoryAgentManager } from '../managers/ExploratoryAgentManager'
import { ExploratoryAgentHandler } from './ExploratoryAgentHandler'
import { ScriptingAgentHandler } from './ScriptingAgentHandler'
import { ScriptingAgentManager } from '../managers/ScriptingAgentManager'

export class IpcHandler {
  private handlers: BaseHandler[]

  constructor(
    windowManager: WindowManager,
    browserManager: BrowserManager,
    storageManager: StorageManager,
    exploratoryAgentManager: ExploratoryAgentManager,
    scriptingAgentManager: ScriptingAgentManager
  ) {
    this.handlers = [
      new ExploratoryAgentHandler(exploratoryAgentManager),
      new ScriptingAgentHandler(scriptingAgentManager),
      new WindowHandler(windowManager),
      new BrowserHandler(browserManager),
      new StorageHandler(storageManager)
    ]
  }

  setupHandlers(): void {
    this.handlers.forEach((handler) => handler.setup())
  }
}
