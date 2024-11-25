import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { useSettingStore } from '@renderer/store/settingStore'
import { useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { RiLoader2Line } from 'react-icons/ri'

interface PropType {
  title: string
  icon: IconType
}

export const UserSettings = ({ title, icon }: PropType) => {
  const { createSetting, getSettingByKey, updateSetting } = useSettingStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    const settings = [
      { key: 'USER_NAME', setter: setName },
      { key: 'USER_EMAIL', setter: setEmail }
    ]
    settings.forEach(({ key, setter }) => {
      const foundSetting = getSettingByKey(key)
      setter(foundSetting?.value ?? '')
    })
  }, [])

  const saveSetting = (key, value, name, type) => {
    const setting = getSettingByKey(key)
    if (setting) {
      updateSetting(setting.id, { value })
    } else {
      createSetting({ key, value, name, type })
    }
  }

  const handleSave = () => {
    try {
      setSaving(true)
      saveSetting('USER_NAME', name, 'Name', 'User')
      saveSetting('USER_EMAIL', email, 'Email', 'User')
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
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
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="w-full">
            <span className="text-md text-gray-300">Email</span>
            <div className="mt-2 flex items-center">
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
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
