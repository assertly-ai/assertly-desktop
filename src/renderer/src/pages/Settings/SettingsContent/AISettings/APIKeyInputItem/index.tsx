import { Input } from '@components/ui/input'
import { useState } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

interface PropType {
  name: string
  value: string
  handleChange: (value: string) => void
}

export const APIKeyInputItem = ({ name, value, handleChange }: PropType) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="space-y-4">
      <span className="text-md text-gray-300">{name}</span>
      <div className="mt-2 flex items-center">
        <div className="relative w-full">
          <Input
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex mt-2 mb-2 items-center text-gray-400 cursor-pointer border-l pl-2  border-zinc-600 border-opacity-90"
            onClick={toggleVisibility}
          >
            {visible ? <RiEyeOffLine /> : <RiEyeLine />}
          </div>
        </div>
      </div>
    </div>
  )
}
