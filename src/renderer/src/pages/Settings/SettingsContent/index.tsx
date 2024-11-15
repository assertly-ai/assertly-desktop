import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { IconType } from 'react-icons'
import { Outlet } from 'react-router-dom'

interface PropType {
  title: string
  icon: IconType
}
export const SettingsContent = ({ title, icon }: PropType) => {
  return (
    <div className="bg-opacity-30 overflow-y-scroll w-full">
      <SettingsHeader title={title} icon={icon} />
      <Separator className="opacity-5" />
      <Outlet />
    </div>
  )
}
