import { usePanelStore } from '../../store/panelStore'
import { RiDropdownList, RiListCheck2, RiTestTubeFill } from 'react-icons/ri'

export const PanelSwitcher = () => {
  const { currentPanel, setCurrentPanel } = usePanelStore()
  const handlePanelSwitchClick = (panel: string) => {
    setCurrentPanel(panel)
  }

  return (
    <div className="flex flex-row gap-10 text-white justify-center p-4">
      <div className="p-1 hover:bg-gray-700 rounded-sm">
        <RiDropdownList
          className={`cursor-pointer ${currentPanel === 'scripts' ? 'text-white text-opacity-100' : 'text-white text-opacity-40'}`}
          onClick={() => handlePanelSwitchClick('scripts')}
        />
      </div>
      <div className="p-1 hover:bg-gray-700 rounded-sm">
        <RiListCheck2
          className={`cursor-pointer ${currentPanel === 'modules' ? 'text-white text-opacity-100' : 'text-white text-opacity-40'}`}
          onClick={() => handlePanelSwitchClick('modules')}
        />
      </div>
      <div className="p-1 hover:bg-gray-700 rounded-sm">
        <RiTestTubeFill
          className={`cursor-pointer ${currentPanel === 'exploratory' ? 'text-white text-opacity-100' : 'text-white text-opacity-40'}`}
          onClick={() => handlePanelSwitchClick('exploratory')}
        />
      </div>
    </div>
  )
}
