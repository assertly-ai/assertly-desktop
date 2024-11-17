import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { IconType } from 'react-icons'
import { ModulSelector } from './ModelSelector'
import { APIKeyInputItem } from './APIKeyInputItem'

interface PropType {
  title: string
  icon: IconType
}
export const AISettings = ({ title, icon }: PropType) => {
  return (
    <>
      <SettingsHeader title={title} icon={icon} />
      <Separator className="opacity-5 ml-2" />
      <div className="p-10 flex flex-col gap-y-4">
        <APIKeyInputItem name="OpenAI" />
        <APIKeyInputItem name="Antropic" />
        <ModulSelector />
      </div>
    </>
  )
}
