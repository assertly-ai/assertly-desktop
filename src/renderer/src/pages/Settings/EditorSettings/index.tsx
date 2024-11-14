import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { RiEdit2Fill } from 'react-icons/ri'
import { Outlet } from 'react-router-dom'

export const EditorSettings = () => {
  return (
    <div className="bg-opacity-30 overflow-y-scroll w-full">
      <SettingsHeader title="Editor Settings" icon={RiEdit2Fill} />
      <Separator className="opacity-5" />
      <Outlet />
    </div>
  )
}
