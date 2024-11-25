import { Button } from '@components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select'
import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { themeList } from '@renderer/lib/constants'
import { useSettingStore } from '@renderer/store/settingStore'
import { range } from 'lodash'
import { useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { RiLoader2Line } from 'react-icons/ri'

interface PropType {
  title: string
  icon: IconType
}

export const EditorSettings = ({ title, icon }: PropType) => {
  const { createSetting, getSettingByKey, updateSetting } = useSettingStore()
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState('')
  const [fontSize, setFontSize] = useState('')
  useEffect(() => {
    const settings = [
      { key: 'EDITOR_THEME', setter: setTheme },
      { key: 'EDITOR_FONT_SIZE', setter: setFontSize }
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
      saveSetting('EDITOR_THEME', theme, 'Theme', 'Editor')
      saveSetting('EDITOR_FONT_SIZE', fontSize, 'Font Size', 'Editor')
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
      <div className="p-10 flex flex-col gap-y-4">
        <div className="space-y-4">
          <span className="text-md text-gray-300">Theme</span>
          <div className="mt-2 flex items-center">
            <Select value={theme} onValueChange={(value) => setTheme(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {themeList.map((theme) => (
                    <SelectItem
                      key={theme}
                      className="focus:bg-white/10 focus:text-white"
                      value={theme}
                    >
                      {theme}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <span className="text-md text-gray-300">Font Size</span>
          <div className="mt-2 flex items-center">
            <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {range(1, 100).map((size) => (
                    <SelectItem
                      key={size}
                      className="focus:bg-white/10 focus:text-white"
                      value={size.toString()}
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
