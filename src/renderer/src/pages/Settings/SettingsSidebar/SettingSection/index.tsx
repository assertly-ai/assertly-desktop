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
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white/10  hover:border hover:border-white/5 
              ${location.pathname === setting.url ? 'bg-white/5 border border-white/5 ' : 'border border-transparent'}`}
            onClick={() => navigate(setting.url)}
          >
            <span className="text-white text-zinc-300/80 text-sm font-semibold">
              {setting.title}
            </span>
          </div>
          <Separator className="opacity-5" />
        </>
      ))}
    </div>
  )
}
