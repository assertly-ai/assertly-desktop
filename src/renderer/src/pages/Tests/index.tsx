import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'

export const Tests = () => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-screen md:min-w-[450px]">
      <ResizablePanel defaultSize={40}>
        <div className="flex m-2 rounded-lg bg-zinc-50 shadow h-[calc(100%-16px)] border p-4">
          <span className="text-xl font-semibold">Tests</span>
        </div>
      </ResizablePanel>
      <ResizableHandle className="ml-[-8px] bg-transparent" withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex justify-center items-center h-full p-6">
          <span className="font-semibold">Browser</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
