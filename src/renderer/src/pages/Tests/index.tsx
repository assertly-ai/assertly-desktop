import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { useEffect, useRef } from 'react'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { ImperativePanelHandle } from 'react-resizable-panels'
import NewTestForm from './TestForm'
import { TestList } from './TestList'
import { Button } from '@components/ui/button'

export const Tests = () => {
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
      <ResizablePanel defaultSize={30} minSize={28} maxSize={40} ref={panelRef}>
        <div className="flex m-2 flex-col bg-zinc-50 shadow h-[calc(100vh-1rem)] rounded-lg p-1">
          <div className="flex justify-between items-center h-10 bg-zinc-800 rounded-lg">
            <div className="flex h-full w-full flex-1 window-drag-region"></div>
            <div className="flex items-center justify-center px-4 text-zinc-50">
              <Button variant="default" size="icon">
                <RiArrowLeftLine />
              </Button>
              <Button variant="default" size="icon">
                <RiArrowRightLine />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 px-2">
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
      <ResizablePanel defaultSize={70}>
        <div className="flex flex-col justify-end h-screen m-2 rounded-lg"></div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
