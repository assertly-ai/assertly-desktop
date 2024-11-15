import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { useState } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

export const APIKeys = () => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div className="p-10">
      <div className="w-full flex justify-start mb-6">
        <span className="text-xl font-bold text-neutral-300">API Keys</span>
      </div>
      <div className="space-y-4">
        <span className="text-md text-gray-300">OpenAI Key</span>
        <div className="mt-2 flex items-center">
          <div className="relative w-full">
            <Input
              type={visible ? 'text' : 'password'}
              className={`bg-transparent text-white placeholder:text-md placeholder:text-white placeholder:text-opacity-20 placeholder:font-medium border border-zinc-500 border-opacity-90 rounded-lg px-3 py-2 w-full hover:border-zinc-400 hover:border-opacity-90 focus:border-zinc-400 focus:border-opacity-90`}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex mt-2 mb-2 items-center text-gray-400 cursor-pointer border-l pl-2  border-zinc-600 border-opacity-90"
              onClick={toggleVisibility}
            >
              {visible ? <RiEyeOffLine /> : <RiEyeLine />}
            </div>
          </div>
          <div className="flex justify-center items-center ml-2 gap-2">
            <Button className="bg-emerald-500 bg-opacity-90 hover:bg-emerald-600">Save</Button>
            <Button className="bg-red-500 bg-opacity-90 hover:bg-red-600">Remove</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
