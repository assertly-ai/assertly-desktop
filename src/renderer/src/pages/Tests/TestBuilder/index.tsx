import { useParams } from 'react-router-dom'
import { ScriptBlocks } from './ScriptBlocks'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { WindowControls } from '@renderer/components/WindowControls/WindowControls'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { useEffect, useRef } from 'react'

export const TestBuilder = () => {
  const { testId } = useParams<{ testId: string }>()
  const panelRef = useRef<ImperativePanelHandle | null>(null)
  const lastKnownSizes = useRef<number[]>([20, 70])

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
  return testId ? (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-screen md:min-w-[450px]"
      onLayout={resizePreview}
    >
      <ResizablePanel defaultSize={20} minSize={20} maxSize={40} ref={panelRef}>
        <div className="flex flex-col h-[calc(100vh-1rem)] rounded-lg">
          <WindowControls />
          <ScriptBlocks testId={testId} />
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-transparent" withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex justify-center items-center h-screen">
          <div className="flex h-[calc(100vh-1rem)] mr-2 flex-1 rounded-lg shadow-xl bg-purple-500 bg-opacity-10" />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ) : null
}
