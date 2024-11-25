import { Outlet } from 'react-router-dom'
import { SettingsSidebar } from './SettingsSidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'

export const Settings = () => {
  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-2rem)] rounded-lg ">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="min-h-full">
          <SettingsSidebar />
        </ResizablePanel>

        <ResizableHandle className="" />

        <ResizablePanel defaultSize={70} minSize={40} className="min-h-full p-2">
          {/* Right Section */}
          <div className="h-full bg-white/5 rounded-lg border border-white/10 p-6 w-full">
            <Outlet />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
