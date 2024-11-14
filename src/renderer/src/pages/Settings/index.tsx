import { Outlet } from 'react-router-dom'
import { SettingsLeftPanel } from './SettingsLeftPanel'
export const Settings = () => {
  return (
    <div className="flex pl-2 h-screen w-screen">
      <SettingsLeftPanel />
      <div className="bg-opacity-30 backdrop-blur-3xl text-white overflow-y-scroll pt-20 pb-2 w-full">
        <Outlet />
      </div>
    </div>
  )
}
