import { Separator } from '@components/ui/separator'
import React from 'react'
import { IconType } from 'react-icons'
import { useLocation, useNavigate } from 'react-router-dom'

interface PropType {
  title: string
  icon: IconType
  settings: {
    title: string
    icon: IconType
    url: string
  }[]
}

export const SettingSection = ({ title, settings, icon }: PropType) => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-2 px-2 py-2">
      <div className="flex items-center gap-2 p-1">
        <span className="text-white text-opacity-40 text-sm font-semibold">
          {React.createElement(icon)}
        </span>
        <span className="text-white text-opacity-40 text-xs font-semibold">{title}</span>
      </div>
      {settings.map((setting) => (
        <>
          <div
            key={setting.title}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:backdrop-blur-sm ${
              location.pathname === setting.url && 'backdrop-blur-lg'
            }`}
            onClick={() => navigate(setting.url)}
          >
            <div className="flex justify-center items-center gap-2">
              <span className="text-white text-opacity-40 text-sm">{setting.title}</span>
            </div>
          </div>
          <Separator className="opacity-5" />
        </>
      ))}
    </div>
  )
}
