import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { useEffect, useRef } from 'react'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import { RiQuillPenLine, RiSearch2Line } from 'react-icons/ri'
import { ImperativePanelHandle } from 'react-resizable-panels'
import NewTestForm from './TestForm'
import { Button } from '@components/ui/button'
import { TestList } from './TestList'
import { Input } from '@components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'

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
      <ResizablePanel defaultSize={20} minSize={20} maxSize={40} ref={panelRef}>
        <div className="flex flex-col h-[calc(100vh-1rem)] rounded-lg">
          <div className="flex justify-between items-center  rounded-lg">
            <div className="flex h-full w-full flex-1 window-drag-region"></div>
            <div className="flex items-center justify-center px-1.5 pr-1 py-1 text-zinc-700">
              <Button
                variant="default"
                size="icon"
                className="text-purple-50 hover:text-opacity-60 text-opacity-30 text-xl"
              >
                <GoArrowLeft />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="text-purple-50 text-opacity-30  hover:text-opacity-60 text-xl"
              >
                <GoArrowRight />
              </Button>
            </div>
          </div>
          <div className="flex items-center px-4 pr-3 py-2">
            <div className="flex justify-start items-center flex-1 bg-purple-50 bg-opacity-[0.08] rounded-lg focus-visible:ring-0 px-3 py-0.5">
              <span className="text-purple-50 text-opacity-20 text-sm">
                <RiSearch2Line />
              </span>
              <Input
                placeholder="Search"
                className="text-white placeholder:text-md placeholder:text-purple-50 placeholder:text-opacity-20 placeholder:font-medium border-transparent rounded-lg focus-visible:ring-0 px-1.5"
              ></Input>
            </div>
          </div>

          <div className="flex justify-start  items-center px-5 pr-2 py-2 text-purple-50 text-opacity-30">
            <div className="flex flex-1 gap-2 justify-start items-center">
              <RiQuillPenLine />
              <span className="text-md font-semibold text-purple-50 text-opacity-30">Scripts</span>
            </div>
            <div className="flex justify-start items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NewTestForm />
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    sideOffset={8}
                    className="bg-[#1a1a1a] rounded-md p-2"
                  >
                    <p className="text-white text-sm">Start a new Test</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <TestList />
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-transparent" withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex justify-center items-center h-screen">
          <div className="flex h-[calc(100vh-1rem)] mr-2 flex-1 rounded-lg shadow-xl bg-purple-500 bg-opacity-10"></div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
