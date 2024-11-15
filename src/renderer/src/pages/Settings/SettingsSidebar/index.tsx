import { Button } from '@components/ui/button'
import { SettingSection } from './SettingSection'
import { settingsSectionsList } from '@renderer/lib/constants'
import { FiSearch } from 'react-icons/fi'
import { RiSettingsLine } from 'react-icons/ri'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'

export const SettingsSidebar = () => {
  return (
    <div className="bg-opacity-100 text-white w-64 h-full flex flex-col">
      <div className="mb-2 mx-1 py-2 px-2 border-b border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RiSettingsLine className="text-xl text-white/40" />
            <h1 className="text-lg font-semibold text-white/40">Settings</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full [&_svg]:size-6"
                  onClick={() => {}}
                >
                  <FiSearch className="text-2xl text-white/40" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-[#1a1a1a] text-[11px] rounded-lg p-2">
                <p className="text-white">Search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
