import React from 'react'
import { IconType } from 'react-icons'
import { useLocation, useNavigate } from 'react-router-dom'

interface PropType {
  title: string
  icon: IconType
  url: string
}

export const SettingMenuItem = ({ title, url, icon }: PropType) => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <div
      key={title}
      className={`flex items-center gap-3 p-2.5 px-4 text-white/40 rounded-md cursor-pointer hover:bg-white/10  hover:border hover:border-white/5
              ${location.pathname === url ? 'bg-white/5 border border-white/5 ' : 'border border-transparent'}`}
      onClick={() => navigate(url)}
    >
      {React.createElement(icon)}
      <span className="text-white text-white/60 text-sm font-medium">{title}</span>
    </div>
  )
}
