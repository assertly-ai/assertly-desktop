import React from 'react'
import { IconType } from 'react-icons'

interface PropType {
  title: string
  icon: IconType
}

export const SettingsHeader = ({ title, icon }: PropType) => {
  return (
    <div className="w-full flex justify-start items-center p-4 gap-4">
      <span className="text-xl text-white/40 rounded-md bg-white/10 p-2">
        {React.createElement(icon)}
      </span>
      <span className="text-2xl font-medium text-white/60">{title}</span>
    </div>
  )
}
