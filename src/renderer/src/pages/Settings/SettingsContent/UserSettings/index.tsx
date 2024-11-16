import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { useState } from 'react'
import { IconType } from 'react-icons'
import { RiLoader2Line } from 'react-icons/ri'

interface PropType {
  title: string
  icon: IconType
}

export const UserSettings = ({ title, icon }: PropType) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
    }, 1000)
  }

  return (
    <>
      <SettingsHeader title={title} icon={icon} />
      <Separator className="opacity-5 ml-2" />
      <div className="flex flex-col justify-between p-10">
        <div className="space-y-4">
          <div className="w-full">
            <span className="text-md text-gray-300">Name</span>
            <div className="mt-2 flex items-center">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-white placeholder:text-md placeholder:text-white placeholder:text-opacity-20 placeholder:font-medium border border-zinc-500 border-opacity-90 rounded-lg px-3 py-2 w-full hover:border-zinc-400 hover:border-opacity-90 focus:border-zinc-400 focus:border-opacity-90"
              />
            </div>
          </div>
          <div className="w-full">
            <span className="text-md text-gray-300">Email</span>
            <div className="mt-2 flex items-center">
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-white placeholder:text-md placeholder:text-white placeholder:text-opacity-20 placeholder:font-medium border border-zinc-500 border-opacity-90 rounded-lg px-3 py-2 w-full hover:border-zinc-400 hover:border-opacity-90 focus:border-zinc-400 focus:border-opacity-90"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end mt-4">
          <Button
            onClick={handleSave}
            className="w-[80px] text-white bg-emerald-400 bg-opacity-90 hover:bg-emerald-600"
          >
            {saving ? <RiLoader2Line className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>
    </>
  )
}
