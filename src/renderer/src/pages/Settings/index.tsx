import { Outlet } from 'react-router-dom'
import { SettingsSidebar } from './SettingsSidebar'

export const Settings = () => {
  return (
    <div className="flex pt-2 pr-2 pb-2 h-screen w-full">
      <SettingsSidebar />
      <div className="bg-opacity-30 flex-1 bg-white/5 rounded-md border border-white/10 pt-1 overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  )
}
