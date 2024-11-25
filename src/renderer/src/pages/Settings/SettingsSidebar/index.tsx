import { SettingMenuItem } from './SettingMenuItem'
import { settingsList } from '@renderer/lib/constants'
import { RiSettingsLine } from 'react-icons/ri'

export const SettingsSidebar = () => {
  return (
    <div className="flex flex-col gap-2 h-full p-2 bg-opacity-100 text-white w-full">
      <div className="py-2 px-2 border-b border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RiSettingsLine className="text-lg text-white/40" />
            <h1 className="text-md font-medium text-white/40">Settings</h1>
          </div>
        </div>
      </div>
      <div className="bg-opacity-60 h-full flex flex-col overflow-y-scroll gap-1 mt-1">
        {settingsList.map((setting, index) => (
          <SettingMenuItem
            key={index}
            title={setting?.title}
            icon={setting?.icon}
            url={setting?.url}
          />
        ))}
        <div className="flex flex-1 window-drag-region"></div>
      </div>
    </div>
  )
}
