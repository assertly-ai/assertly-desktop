import { Container } from './Container'
import { ElectronAdapter } from '../adapters/ElectronAdapter'
import { WindowManager } from '../managers/WindowManager'
import { BrowserManager } from '../managers/BrowserManager'
import { StorageManager } from '../managers/StorageManager'
import { IpcHandler } from '../handlers/IpcHandler'
import { PlaywrightAdapter } from '../adapters/PlaywrightAdapter'

export class App {
  private electronAdapter: ElectronAdapter
  private windowManager: WindowManager
  private browserManager: BrowserManager
  private storageManager: StorageManager
  private ipcHandler: IpcHandler
  private playwrightAdapter: PlaywrightAdapter

  constructor(private container: Container) {
    this.electronAdapter = this.container.get('electronAdapter')
    this.windowManager = this.container.get('windowManager')
    this.browserManager = this.container.get('browserManager')
    this.ipcHandler = this.container.get('ipcHandler')
    this.playwrightAdapter = this.container.get('playwrightAdapter')
    this.storageManager = this.container.get('storageManager')
  }

  async start(): Promise<void> {
    await this.electronAdapter.initializeDebuggingPort()
    this.storageManager.initialize()

    this.electronAdapter.onReady(async () => {
      const mainWindow = this.windowManager.createMainWindow()
      this.windowManager.setMainWindow(mainWindow)

      const port = this.electronAdapter.getDebuggingPort()
      if (!port) {
        throw new Error('Debugging port not set. Was initializeDebuggingPort called?')
      }

      const webSocketDebuggerUrl = await this.electronAdapter.getDebuggerUrl(port)
      await this.playwrightAdapter.connect(webSocketDebuggerUrl)

      this.ipcHandler.setupHandlers()

      this.electronAdapter.onActivate(() => {
        if (this.windowManager.getAllWindows().length === 0) {
          const newMainWindow = this.windowManager.createMainWindow()
          this.windowManager.setMainWindow(newMainWindow)
        }
      })
    })

    this.electronAdapter.onWindowAllClosed(() => {
      if (process.platform !== 'darwin') {
        this.electronAdapter.quit()
      }
    })

    this.electronAdapter.onBeforeQuit(async () => {
      await this.browserManager.closeBrowser()
    })
  }
}
