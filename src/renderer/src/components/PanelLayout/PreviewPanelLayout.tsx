import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { WindowControls } from '@renderer/components/WindowControls/WindowControls'
import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

type PreviewPanelLayoutProps = {
  leftPanel: React.ReactNode
  rightPanel?: React.ReactNode
  leftPanelConfig?: {
    defaultWidth: number
    minWidth: number
    maxWidth: number
  }
  hasPreview?: boolean
}

export const PreviewPanelLayout = ({
  leftPanel,
  rightPanel,
  leftPanelConfig = {
    defaultWidth: 600,
    minWidth: 400,
    maxWidth: 600
  },
  hasPreview = false
}: PreviewPanelLayoutProps) => {
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)
  const [, setIsResizing] = useState(false)

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

  const { leftPercent: initialLeftPercent, rightPercent: initialRightPercent } = getPercentages(
    leftPanelConfig.defaultWidth
  )

  const handlePanelResize = (sizes: number[]) => {
    if (!hasPreview) return
    window.electron.ipcRenderer.send('panel-resized', sizes)
  }

  useEffect(() => {
    if (hasPreview) {
      window.electron.ipcRenderer.send('toggle-preview', true)
      window.electron.ipcRenderer.send('panel-resized', [initialLeftPercent, initialRightPercent])
    }

    return () => {
      if (hasPreview) {
        window.electron.ipcRenderer.send('toggle-preview', false)
      }
    }
  }, [hasPreview])

  console.log('PreviewPaneLayout', {
    initialLeftPercent,
    initialRightPercent
  })

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-screen"
      onLayout={handlePanelResize}
      style={{ minWidth: `${leftPanelConfig.minWidth + 400}px` }}
    >
      <ResizablePanel
        ref={leftPanelRef}
        defaultSize={initialLeftPercent}
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
          <div className="flex overflow-hidden">{leftPanel}</div>
          <div className="flex-1 overflow-hidden window-drag-region"></div>
        </div>
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="bg-transparent"
        onDragging={(isDragging) => setIsResizing(isDragging)}
      />

      <ResizablePanel
        ref={rightPanelRef}
        defaultSize={initialRightPercent}
        className="min-h-0 ResizablePanel"
      >
        <div className="h-full w-full">
          {rightPanel || (
            <div className="h-screen w-full p-2 pl-0">
              <div className="h-full w-full rounded-lg shadow-xl bg-white bg-opacity-10" />
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
