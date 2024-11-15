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
    <div className="bg-opacity-30 flex-1 bg-white/5 rounded-lg border border-white/10 pt-6 overflow-clip">
      <SettingsHeader title={title} icon={icon} />
      <Separator className="opacity-5 ml-2" />
      <Outlet />
    </div>
  )
}
