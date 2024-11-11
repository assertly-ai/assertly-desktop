import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { WindowControls } from '@renderer/components/WindowControls/WindowControls'
import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { PanelSwitcher } from './PanelSwitcher'
import { Outlet } from 'react-router-dom'

type PanelLayoutProps = {
  leftPanelConfig?: {
    defaultWidth: number
    minWidth: number
    maxWidth: number
  }
  rightPanel?: React.ReactNode
}

export const PanelLayout = ({
  rightPanel,
  leftPanelConfig = {
    defaultWidth: 300,
    minWidth: 250,
    maxWidth: 400
  }
}: PanelLayoutProps) => {
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)
  const leftPanelContentRef = useRef<HTMLDivElement>(null)

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

  const { rightPercent: initialRightPercent } = getPercentages(leftPanelConfig.defaultWidth)

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

  useEffect(() => {
    const leftPanel = leftPanelContentRef.current
    if (!leftPanel) return

    let touchStartX = 0
    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scroll or when shift key is pressed
      if (!e.shiftKey && Math.abs(e.deltaX) < Math.abs(e.deltaY)) return

      e.preventDefault()

      if (isScrolling) return

      isScrolling = true
      clearTimeout(scrollTimeout)

      const direction = e.deltaX > 0 || e.deltaY > 0 ? 'next' : 'prev'
      window.dispatchEvent(new CustomEvent('panel-scroll', { detail: { direction } }))

      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 500) // Debounce scroll events
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndX = e.touches[0].clientX
      const deltaX = touchStartX - touchEndX

      if (Math.abs(deltaX) > 50) {
        // Threshold for swipe
        e.preventDefault()
        const direction = deltaX > 0 ? 'next' : 'prev'
        window.dispatchEvent(new CustomEvent('panel-scroll', { detail: { direction } }))
        touchStartX = touchEndX
      }
    }

    leftPanel.addEventListener('wheel', handleWheel, { passive: false })
    leftPanel.addEventListener('touchstart', handleTouchStart)
    leftPanel.addEventListener('touchmove', handleTouchMove)

    return () => {
      leftPanel.removeEventListener('wheel', handleWheel)
      leftPanel.removeEventListener('touchstart', handleTouchStart)
      leftPanel.removeEventListener('touchmove', handleTouchMove)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-screen"
      onLayout={handlePanelResize}
      style={{ minWidth: `${leftPanelConfig.minWidth + 100}px` }}
    >
      <ResizablePanel>
        <div className="h-full w-full flex flex-col overflow-hidden">
          <div className="">
            <WindowControls />
          </div>
          <div ref={leftPanelContentRef} className="flex flex-col h-[calc(100vh-44px)] pb-2">
            <div className="overflow-hidden">
              <Outlet />
            </div>
            <div className="flex flex-1 window-drag-region"></div>
            <PanelSwitcher />
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
