import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { useAPIKeyStore } from '@renderer/store/apiKeyStore'
import APIKey from '@renderer/types/apiKey'
import { useEffect, useState } from 'react'
import { RiEyeLine, RiEyeOffLine, RiLoader2Fill } from 'react-icons/ri'

export const APIKeys = () => {
  const { createAPIKey, getAPIKeyByName, updateAPIKey } = useAPIKeyStore()
  const [openAIKey, setOpenAIKey] = useState('')
  const [removing, setRemoving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useEffect(() => {
    const getOpenAIKey = async () => {
      const apiKey = await getAPIKeyByName('openai')
      if (apiKey) {
        setOpenAIKey(apiKey.apiKey)
      }
    }
    getOpenAIKey()
  }, [])

  const handleRemopve = async (name: string) => {
    setRemoving(true)
    try {
      const apiKey: APIKey = await getAPIKeyByName(name)
      if (apiKey) {
        updateAPIKey(apiKey.id, { apiKey: '' })
        setOpenAIKey('')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setRemoving(false)
    }
  }

  const handleSave = async (name: string, value: string) => {
    setSaving(true)
    try {
      const apiKey: APIKey = await getAPIKeyByName(name)
      console.log(apiKey)
      if (apiKey) {
        updateAPIKey(apiKey.id, { apiKey: value })
      } else {
        createAPIKey({
          name: name,
          apiKey: value
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
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
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
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
            <Button
              onClick={() => handleSave('openai', openAIKey)}
              disabled={saving}
              className="bg-emerald-500 bg-opacity-90 hover:bg-emerald-600"
            >
              {saving && <RiLoader2Fill className="animate-spin" />}
              Save
            </Button>
            <Button
              disabled={removing}
              onClick={() => handleRemopve('openai')}
              className="bg-red-500 bg-opacity-90 hover:bg-red-600"
            >
              {removing && <RiLoader2Fill className="animate-spin" />}
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
