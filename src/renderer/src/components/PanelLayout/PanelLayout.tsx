import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { WindowControls } from '@renderer/components/WindowControls/WindowControls'
import { useEffect, useRef } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

type PanelLayoutProps = {
  leftPanel: React.ReactNode
  rightPanel?: React.ReactNode
  defaultLeftSize?: number
  defaultRightSize?: number
  minLeftSize?: number
  maxLeftSize?: number
}

export const PanelLayout = ({
  leftPanel,
  rightPanel,
  defaultLeftSize = 20,
  defaultRightSize = 80,
  minLeftSize = 20,
  maxLeftSize = 40
}: PanelLayoutProps) => {
  const panelRef = useRef<ImperativePanelHandle | null>(null)
  const lastKnownSizes = useRef<number[]>([defaultLeftSize, defaultRightSize])

  const resizePreview = (sizes: number[]) => {
    lastKnownSizes.current = sizes
    window.electron.ipcRenderer.send('panel-resized', sizes)
  }

  useEffect(() => {
    const handleResize = () => {
      window.electron.ipcRenderer.send('panel-resized', lastKnownSizes.current)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-screen md:min-w-[450px]"
      onLayout={resizePreview}
    >
      <ResizablePanel
        defaultSize={defaultLeftSize}
        minSize={minLeftSize}
        maxSize={maxLeftSize}
        ref={panelRef}
      >
        <div className="flex flex-col h-[calc(100vh-1rem)] rounded-lg">
          <WindowControls />
          {leftPanel}
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-transparent" withHandle />
      <ResizablePanel defaultSize={defaultRightSize}>
        <div className="flex justify-center items-center h-screen">
          {rightPanel || (
            <div className="flex h-[calc(100vh-1rem)] mr-2 flex-1 rounded-lg shadow-xl bg-purple-500 bg-opacity-10" />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
