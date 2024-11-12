import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { WindowControls } from '@renderer/components/WindowControls/WindowControls'
import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { PanelSwitcher } from './PanelSwitcher'
import { Outlet } from 'react-router-dom'
import { Button } from '@components/ui/button'
import { RiFileCopy2Line, RiShiningLine } from 'react-icons/ri'

type PanelLayoutProps = {
  leftPanelConfig?: {
    defaultWidth: number
    minWidth: number
    maxWidth: number
  }
  rightPanel?: React.ReactNode
  hasPreview?: boolean
}

export const PanelLayout = ({
  rightPanel,
  leftPanelConfig = {
    defaultWidth: 300,
    minWidth: 250,
    maxWidth: 600
  },
  hasPreview = false
}: PanelLayoutProps) => {
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)
  const [, setIsResizing] = useState(false)

  // Store the initial percentages in state
  const [initialSizes] = useState(() => {
    const windowWidth = window.innerWidth
    const constrainedWidth = Math.max(
      leftPanelConfig.minWidth,
      Math.min(leftPanelConfig.maxWidth, leftPanelConfig.defaultWidth)
    )
    return {
      leftPercent: Number(((constrainedWidth / windowWidth) * 100).toFixed(1)),
      rightPercent: Number((((windowWidth - constrainedWidth) / windowWidth) * 100).toFixed(1))
    }
  })

  const getPercentages = (pixelWidth: number) => {
    const windowWidth = window.innerWidth
    const constrainedWidth = Math.max(
      leftPanelConfig.minWidth,
      Math.min(leftPanelConfig.maxWidth, pixelWidth)
    )
    return {
      leftPercent: Number(((constrainedWidth / windowWidth) * 100).toFixed(1)),
      rightPercent: Number((((windowWidth - constrainedWidth) / windowWidth) * 100).toFixed(1))
    }
  }

  const handlePanelResize = (sizes: number[]) => {
    if (!hasPreview) return
    window.electron.ipcRenderer.send('panel-resized', sizes)
  }

  useEffect(() => {
    if (hasPreview) {
      window.electron.ipcRenderer.send('toggle-preview', true)
      window.electron.ipcRenderer.send('panel-resized', [
        initialSizes.leftPercent,
        initialSizes.rightPercent
      ])
    }

    return () => {
      if (hasPreview) {
        window.electron.ipcRenderer.send('toggle-preview', false)
      }
    }
  }, [hasPreview, initialSizes])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-screen"
      onLayout={handlePanelResize}
      style={{ minWidth: `${leftPanelConfig.minWidth + 400}px` }}
    >
      <ResizablePanel
        ref={leftPanelRef}
        defaultSize={initialSizes.leftPercent}
        minSize={getPercentages(leftPanelConfig.minWidth).leftPercent}
        maxSize={getPercentages(leftPanelConfig.maxWidth).leftPercent}
        className="min-h-0 ResizablePanel"
        style={{
          minWidth: `${leftPanelConfig.minWidth}px`,
          maxWidth: `${leftPanelConfig.maxWidth}px`
        }}
      >
        <div className="h-full w-full flex flex-col">
          <div className="w-full">
            <WindowControls />
          </div>
          <div className="flex flex-col overflow-y-scroll h-[calc(100vh-44px)]">
            <div className="overflow-hidden flex-1">
              <Outlet />
            </div>
            <PanelSwitcher />
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="bg-transparent opacity-100"
        onDragging={(isDragging) => setIsResizing(isDragging)}
      />

      <ResizablePanel
        ref={rightPanelRef}
        defaultSize={initialSizes.rightPercent}
        className="min-h-0 ResizablePanel"
      >
        <div className="h-screen w-full">
          {rightPanel || (
            <div className="flex flex-col h-screen w-full p-2 gap-1">
              <div className="flex items-center justify-center mt-1">
                <div className="flex flex-1 h-full items-center justify-between gap-2 rounded-md bg-white bg-opacity-10 text-sm mb-2">
                  <div className="flex flex-1 items-center justify-start px-4">
                    <span className="text-xs text-white/90 tracking-wide">about:blank</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 pr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 [&_svg]:size-3 text-white/90 hover:bg-white/20 hover:text-white"
                      onClick={() => {}}
                    >
                      <RiFileCopy2Line />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 [&_svg]:size-3 text-white/90 hover:bg-white/20 hover:text-white"
                      onClick={() => {}}
                    >
                      <RiShiningLine />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-full w-full rounded-lg shadow-xl bg-white bg-opacity-10" />
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
