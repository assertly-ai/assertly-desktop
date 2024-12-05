import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

type PanelLayoutProps = {
  leftPanelConfig?: {
    defaultWidth: number
    minWidth: number
    maxWidth: number
  }
  children: React.ReactNode
}

export const PanelLayout = ({
  leftPanelConfig = {
    defaultWidth: 400,
    minWidth: 400,
    maxWidth: 800
  },
  children
}: PanelLayoutProps) => {
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)
  const [, setIsResizing] = useState(false)

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
    window.electron.ipcRenderer.send('panel-resized', {
      type: 'scripting',
      sizes
    })
  }

  useEffect(() => {
    // Initialize preview
    window.electron.ipcRenderer.send('toggle-preview', {
      show: true,
      type: 'scripting',
      sizes: [initialSizes.leftPercent, initialSizes.rightPercent]
    })

    // Initial panel resize
    window.electron.ipcRenderer.send('panel-resized', {
      type: 'scripting',
      sizes: [initialSizes.leftPercent, initialSizes.rightPercent]
    })

    return () => {
      window.electron.ipcRenderer.send('toggle-preview', {
        show: false,
        type: 'scripting'
      })
    }
  }, [initialSizes])

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
        className="min-h-0"
        style={{
          minWidth: `${leftPanelConfig.minWidth}px`,
          maxWidth: `${leftPanelConfig.maxWidth}px`
        }}
      >
        <div className="flex h-screen">
          <div className="w-full flex flex-col flex-1">
            <div className="flex flex-col overflow-y-auto h-full">{children}</div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="bg-transparent"
        onDragging={(isDragging) => setIsResizing(isDragging)}
      />

      <ResizablePanel
        ref={rightPanelRef}
        defaultSize={initialSizes.rightPercent}
        className="min-h-0"
      >
        <div className="h-screen w-full">
          {/* Preview container */}
          <div className="flex flex-col h-full w-full p-2">
            <div className="flex-1 rounded-lg border border-white/10" />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
