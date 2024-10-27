import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { WindowControls } from '@renderer/components/WindowControls/WindowControls'
import { useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

type PanelLayoutProps = {
  leftPanel: React.ReactNode
  rightPanel?: React.ReactNode
  leftPanelConfig?: {
    defaultWidth: number
    minWidth: number
    maxWidth: number
  }
}

export const PanelLayout = ({
  leftPanel,
  rightPanel,
  leftPanelConfig = {
    defaultWidth: 300,
    minWidth: 250,
    maxWidth: 400
  }
}: PanelLayoutProps) => {
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)
  const [, setIsResizing] = useState(false)

  const getPercentages = (pixelWidth: number) => {
    const windowWidth = window.innerWidth
    const constrainedWidth = Math.max(
      leftPanelConfig.minWidth,
      Math.min(leftPanelConfig.maxWidth, pixelWidth)
    )
    const availableWidth = Math.max(windowWidth, leftPanelConfig.minWidth + 100)
    const leftPercent = Number(((constrainedWidth / availableWidth) * 100).toFixed(2))
    const rightPercent = Number((100 - leftPercent).toFixed(2))
    return { leftPercent, rightPercent }
  }

  const { leftPercent: initialLeftPercent, rightPercent: initialRightPercent } = getPercentages(
    leftPanelConfig.defaultWidth
  )

  const handlePanelResize = (sizes: number[]) => {
    const windowWidth = window.innerWidth
    const leftPanelWidth = (windowWidth * sizes[0]) / 100

    if (leftPanelWidth < leftPanelConfig.minWidth || leftPanelWidth > leftPanelConfig.maxWidth) {
      const constrainedWidth = Math.max(
        leftPanelConfig.minWidth,
        Math.min(leftPanelConfig.maxWidth, leftPanelWidth)
      )
      const { leftPercent, rightPercent } = getPercentages(constrainedWidth)

      if (leftPanelRef.current) leftPanelRef.current.resize(leftPercent)
      if (rightPanelRef.current) rightPanelRef.current.resize(rightPercent)
    }
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-screen"
      onLayout={handlePanelResize}
      style={{ minWidth: `${leftPanelConfig.minWidth + 100}px` }}
    >
      <ResizablePanel
        ref={leftPanelRef}
        defaultSize={initialLeftPercent}
        minSize={getPercentages(leftPanelConfig.minWidth).leftPercent}
        maxSize={getPercentages(leftPanelConfig.maxWidth).leftPercent}
        className="min-h-0"
        style={{ minWidth: `${leftPanelConfig.minWidth}px` }}
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex-shrink-0">
            <WindowControls />
          </div>
          <div className="flex flex-col flex-1 overflow-y-scroll h-[calc(100vh-44px)]">
            <div className="overflow-hidden">{leftPanel}</div>
            <div className="flex flex-1 window-drag-region"></div>
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
        defaultSize={initialRightPercent}
        className="min-h-0"
        style={{ minWidth: '100px' }}
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
