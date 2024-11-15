import { Outlet } from 'react-router-dom'
import { SettingsSidebar } from './SettingsSidebar'
export const Settings = () => {
  return (
    <div className="flex p-2 h-screen w-full">
      <SettingsSidebar />
      <Outlet />
    </div>
  )
}
