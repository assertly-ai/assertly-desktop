import { useState } from 'react'
import { usePanelStore } from '../../store/panelStore'
import { RiDropdownList, RiListCheck2, RiTestTubeFill } from 'react-icons/ri'

export const PanelSwitcher = () => {
  const { currentPanel, setCurrentPanel } = usePanelStore()
  const [isHovered, setIsHovered] = useState(false)

  const handlePanelSwitchClick = (panel: string) => {
    setCurrentPanel(panel)
  }

  return (
    <div
      className="flex flex-row gap-10 justify-center p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {['scripts', 'modules', 'exploratory'].map((panel, index) => {
        const Icon = [RiDropdownList, RiListCheck2, RiTestTubeFill][index]
        return (
          <div
            key={panel}
            className={`p-1 rounded-sm transition-all duration-300 ${isHovered ? 'hover:bg-gray-700' : ''}`}
          >
            <Icon
              className={`cursor-pointer transition-all duration-300 transform ${
                isHovered
                  ? currentPanel === panel
                    ? 'text-white text-opacity-100 scale-110'
                    : 'text-white text-opacity-40 scale-100'
                  : currentPanel === panel
                    ? 'text-white text-opacity-100 scale-80'
                    : 'text-gray-500 scale-75'
              }`}
              onClick={() => handlePanelSwitchClick(panel)}
            />
          </div>
        )
      })}
    </div>
  )
}
