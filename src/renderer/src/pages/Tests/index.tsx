import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { useEffect, useRef } from 'react'
import NewTestForm from './NewTestForm'
import { TestList } from './TestList'
import { useTestStore } from '@renderer/store/testStore'
import { ImperativePanelHandle } from 'react-resizable-panels'

export const Tests = () => {
  const { data: tests } = useTestStore()
  const panelRef = useRef<ImperativePanelHandle | null>(null)

  const resizePreview = (sizes) => {
    window.electron.ipcRenderer.send('panel-resized', sizes)
  }

  useEffect(() => {
    const handleResize = () => {
      window.electron.ipcRenderer.send('resize-preview')

      if (panelRef.current) {
        panelRef.current.resize(30)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  async function runPlaywrightCode(code: string) {
    try {
      const result = (await window.api.executePlaywrightCode(code)) as {
        success: boolean
        data?: unknown
        error?: string
      }
      if (!result.success) {
        console.error('Error executing Playwright code:', result.error)
      }
    } catch (error) {
      console.error('Error calling executePlaywrightCode:', error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      runPlaywrightCode(`
        await page.goto('https://assertly.ai');
        return await page.title();
      `)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-screen md:min-w-[450px]"
      onLayout={resizePreview}
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
        <div className="flex flex-col h-[calc(100vh-1rem)] bg-zinc-50 shadow rounded-lg m-2">
          <div className="flex h-screen window-drag-region bg-zinc-800 rounded-lg text-white"></div>
          <div className="flex justify-between items-center pt-5 px-2">
            <span className="text-xl font-semibold">Tests</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NewTestForm />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  sideOffset={8}
                  className="bg-[#1a1a1a] rounded-md p-2 shadow-md"
                >
                  <p className="text-white text-sm">Start a new Test</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TestList />
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-transparent ml-[-0.7rem]" withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex flex-col justify-end h-screen m-2 rounded-lg"></div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
