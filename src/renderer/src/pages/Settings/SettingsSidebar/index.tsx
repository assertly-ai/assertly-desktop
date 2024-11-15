import { WindowControls } from '@renderer/components/WindowControls/WindowControls'
import { SettingSection } from './SettingSection'
import { settingsSectionsList } from '@renderer/lib/constants'

export const SettingsSidebar = () => {
  return (
    <div className="bg-opacity-100 text-white w-64 h-full flex flex-col pt-20 pb-2 overflow-y-scroll">
      <WindowControls />
      <div className="bg-opacity-60 h-screen flex flex-col overflow-scroll">
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
