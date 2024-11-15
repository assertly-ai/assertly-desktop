import { SettingSection } from './SettingSection'
import { settingsSectionsList } from '@renderer/lib/constants'
import { RiSettings2Fill } from 'react-icons/ri'

export const SettingsSidebar = () => {
  return (
    <div className="bg-opacity-100 text-white w-64 h-full flex flex-col gap-10">
      <div className="mt-12 p-2 flex gap-2 items-center">
        <RiSettings2Fill className="text-3xl opacity-70" />
        <span className="text-3xl opacity-80">Settings</span>
      </div>
      <div className="bg-opacity-60 h-screen flex flex-col overflow-y-scroll">
        {settingsSectionsList.map((section, index) => (
          <SettingSection
            key={index}
            title={section.title}
            icon={section.icon}
            settings={section.settings}
          />
        ))}
        <div className="flex flex-1 window-drag-region"></div>
      </div>
    </div>
  )
}
