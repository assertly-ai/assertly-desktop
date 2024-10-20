import { App, BrowserWindow } from 'electron'
import portfinder from 'portfinder'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import http from 'http'

type BrowserInfo = {
  webSocketDebuggerUrl: string
}

export class ElectronAdapter {
  constructor(private app: App) {}

  onReady(callback: () => void): void {
    this.app.whenReady().then(callback)
  }

  onActivate(callback: () => void): void {
    this.app.on('activate', callback)
  }

  onWindowAllClosed(callback: () => void): void {
    this.app.on('window-all-closed', callback)
  }

  onBeforeQuit(callback: () => void): void {
    this.app.on('before-quit', callback)
  }

  quit(): void {
    this.app.quit()
  }

  setAppUserModelId(id: string): void {
    electronApp.setAppUserModelId(id)
  }

  watchWindowShortcuts(window: BrowserWindow): void {
    optimizer.watchWindowShortcuts(window)
  }

  async initializeDebuggingPort(port = 0): Promise<number> {
    const actualPort = port === 0 ? await portfinder.getPortPromise() : port
    this.app.commandLine.appendSwitch('remote-debugging-port', `${actualPort}`)
    this.app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1')

    const electronMajor = parseInt(this.app.getVersion().split('.')[0], 10)
    if (electronMajor >= 7) {
      this.app.commandLine.appendSwitch('enable-features', 'NetworkService')
    }

    return actualPort
  }

  getDebuggingPort(): string {
    return this.app.commandLine.getSwitchValue('remote-debugging-port')
  }

  async getDebuggerUrl(port: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let json = ''
      const request = http.request(
        {
          host: '127.0.0.1',
          path: '/json/version',
          port
        },
        (response) => {
          response.on('error', reject)
          response.on('data', (chunk: Buffer) => {
            json += chunk.toString()
          })
          response.on('end', () => {
            const browserInfo: BrowserInfo = JSON.parse(json)
            resolve(browserInfo.webSocketDebuggerUrl)
          })
        }
      )
      request.on('error', reject)
      request.end()
    })
  }
}
