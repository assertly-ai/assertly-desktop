import React from 'react'
import { IconType } from 'react-icons'

interface PropType {
  title: string
  icon: IconType
}

export const SettingsHeader = ({ title, icon }: PropType) => {
  return (
    <div className="w-full flex justify-start p-10 pb-4 gap-3">
      <span className="text-3xl opacity-80 text-neutral-100">{React.createElement(icon)}</span>
      <span className="text-2xl font-bold text-neutral-100 text-opacity-80">{title}</span>
    </div>
  )
}
