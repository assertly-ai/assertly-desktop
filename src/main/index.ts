import { app } from 'electron'
import { Container } from './core/Container'
import { App } from './core/App'
import { ElectronAdapter } from './adapters/ElectronAdapter'
import { PlaywrightAdapter } from './adapters/PlaywrightAdapter'
import { WindowManager } from './managers/WindowManager'
import { BrowserManager } from './managers/BrowserManager'
import { IpcHandler } from './handlers/IpcHandler'

const container = new Container()

container.register('electronAdapter', () => new ElectronAdapter(app))
container.register('playwrightAdapter', () => new PlaywrightAdapter())
container.register('windowManager', (c) => new WindowManager(c.get('electronAdapter')))
container.register(
  'browserManager',
  (c) => new BrowserManager(c.get('playwrightAdapter'), c.get('windowManager'))
)
container.register('ipcHandler', (c) => new IpcHandler(c.get('windowManager')))

const application = new App(container)
application.start().catch((error) => {
  console.error('Failed to start application:', error)
  app.quit()
})
