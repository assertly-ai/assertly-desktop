import { Separator } from '@components/ui/separator'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { IconType } from 'react-icons'
import { ModulSelector } from './ModelSelector'
import { APIKeyInputItem } from './APIKeyInputItem'
import { useEffect, useState } from 'react'
import { modelList } from '@renderer/lib/constants'
import { Button } from '@components/ui/button'
import { useSettingStore } from '@renderer/store/settingStore'
import { RiLoader2Line } from 'react-icons/ri'

interface PropType {
  title: string
  icon: IconType
}
export const AISettings = ({ title, icon }: PropType) => {
  const { createSetting, getSettingByKey, updateSetting } = useSettingStore()
  const [openAI, setOpenAI] = useState<string>('')
  const [antropic, setAntropic] = useState<string>('')
  const [model, setModel] = useState<string>('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    const settings = [
      { key: 'OPENAI_API_KEY', setter: setOpenAI },
      { key: 'ANTROPIC_API_KEY', setter: setAntropic },
      { key: 'MODEL', setter: setModel }
    ]
    settings.forEach(({ key, setter }) => {
      const foundSetting = getSettingByKey(key)
      setter(foundSetting?.value ?? '')
    })
  }, [])

  const saveSetting = (key, value, name, type) => {
    const openAIAPIKeySetting = getSettingByKey(key)
    if (openAIAPIKeySetting) {
      updateSetting(openAIAPIKeySetting.id, { value })
    } else {
      createSetting({ key, value, name, type })
    }
  }

  const handleSave = () => {
    try {
      setSaving(true)
      saveSetting('OPENAI_API_KEY', openAI, 'OpenAI API Key', 'AI')
      saveSetting('ANTROPIC_API_KEY', antropic, 'Antropic API Key', 'AI')
      saveSetting('MODEL', model, 'Model', 'AI')
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
        <APIKeyInputItem name="OpenAI API Key" value={openAI} handleChange={setOpenAI} />
        <APIKeyInputItem name="Antropic API Key" value={antropic} handleChange={setAntropic} />
        <ModulSelector name="Model" value={model} handleChange={setModel} optionsList={modelList} />
        <div className="flex justify-end">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSave}>
            {saving ? <RiLoader2Line className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>
    </>
  )
}
