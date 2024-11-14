import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { RiAiGenerate } from 'react-icons/ri'
import { Outlet } from 'react-router-dom'

export const AISettings = () => {
  return (
    <div className="overflow-y-scroll w-full">
      <SettingsHeader title={'AI Settings'} icon={RiAiGenerate} />
      <Separator className="opacity-5" />
      <Outlet />
    </div>
  )
}
