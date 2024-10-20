import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { useEffect, useRef } from 'react'

export const Tests = () => {
  const panelRef = useRef(null)

  const resizePreview = (sizes) => {
    window.electron.ipcRenderer.send('panel-resized', sizes)
  }

  useEffect(() => {
    const handleResize = () => {
      window.electron.ipcRenderer.send('resize-preview')

      // Reset the left panel to its default size
      if (panelRef.current) {
        panelRef.current.resize(30)
      }
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
      <ResizablePanel defaultSize={30} minSize={25} maxSize={45} ref={panelRef}>
        <div className="flex m-2 flex-col bg-zinc-50 shadow h-[calc(100vh-1rem)] rounded-lg p-1">
          <div className="flex h-10 window-drag-region bg-zinc-800 rounded-lg"></div>
          <span className="text-xl font-semibold">Tests</span>
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-transparent ml-[-0.7rem]" withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex m-2 flex-col justify-end h-screen rounded-lg"></div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
