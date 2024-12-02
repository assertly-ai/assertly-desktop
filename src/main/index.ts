import { app } from 'electron'
import { Container } from './core/Container'
import { App } from './core/App'
import { ElectronAdapter } from './adapters/ElectronAdapter'
import { PlaywrightAdapter } from './adapters/PlaywrightAdapter'
import { WindowManager } from './managers/WindowManager'
import { BrowserManager } from './managers/BrowserManager'
import { IpcHandler } from './handlers/IpcHandler'
import { StorageManager } from './managers/StorageManager'
import { OpenAIAdapter } from './adapters/OpenAIAdapter'
import { ExploratoryAgentManager } from './managers/ExploratoryAgentManager'
import { ScriptingAgentManager } from './managers/ScriptingAgentManager'

const container = new Container()

container.register('electronAdapter', () => new ElectronAdapter(app))
container.register('playwrightAdapter', () => new PlaywrightAdapter())
container.register('storageManager', () => new StorageManager())
container.register('windowManager', (c) => new WindowManager(c.get('electronAdapter')))
container.register('openAIAdapter', () => new OpenAIAdapter())
container.register(
  'browserManager',
  (c) => new BrowserManager(c.get('playwrightAdapter'), c.get('windowManager'))
)

container.register(
  'exploratoryAgentManager',
  (c) =>
    new ExploratoryAgentManager(
      c.get('openAIAdapter'),
      c.get('browserManager'),
      c.get('windowManager')
    )
)

container.register(
  'scriptingAgentManager',
  (c) => new ScriptingAgentManager(c.get('openAIAdapter'), c.get('windowManager'))
)

container.register(
  'ipcHandler',
  (c) =>
    new IpcHandler(
      c.get('windowManager'),
      c.get('browserManager'),
      c.get('storageManager'),
      c.get('exploratoryAgentManager'),
      c.get('scriptingAgentManager')
    )
)

const application = new App(container)
application.start().catch((error) => {
  console.error('Failed to start application:', error)
  app.quit()
})
