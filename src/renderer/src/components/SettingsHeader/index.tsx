import React from 'react'
import { IconType } from 'react-icons'

interface PropType {
  title: string
  icon: IconType
}

export const SettingsHeader = ({ title, icon }: PropType) => {
  return (
    <div className="w-full flex justify-start items-center p-4 gap-4">
      <span className="text-2xl text-white/40">{React.createElement(icon)}</span>
      <span className="text-2xl font-semibold text-white/80">{title}</span>
    </div>
  )
}
