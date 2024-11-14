import { Outlet } from 'react-router-dom'
import { SettingsLeftPanel } from './SettingsLeftPanel'
export const Settings = () => {
  return (
    <div className="flex pl-2 h-screen w-screen">
      <SettingsLeftPanel />
      <div className="backdrop-blur-xl text-white overflow-y-scroll pt-20 pb-2 w-full">
        <Outlet />
      </div>
    </div>
  )
}
