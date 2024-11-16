import { Button } from '@components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select'
import { modelList } from '@renderer/lib/constants'
import { useState } from 'react'
import { RiLoader2Line } from 'react-icons/ri'

export const ModulSelector = () => {
  const [model, setModel] = useState('')
  const [saving, setSaving] = useState(false)
  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
    }, 1000)
  }
  return (
    <div className="space-y-4">
      <span className="text-md text-gray-300">Model</span>
      <div className="mt-2 flex items-center">
        <div className="relative w-full">
          <Select value={model} onValueChange={(value) => setModel(value)}>
            <SelectTrigger
              className={`bg-transparent text-white placeholder:text-md placeholder:text-white placeholder:text-opacity-20 placeholder:font-medium border border-zinc-500 border-opacity-90 rounded-lg px-3 py-2 w-full hover:border-zinc-400 hover:border-opacity-90 focus:border-zinc-400 focus:border-opacity-90`}
            >
              <SelectValue placeholder="Select a Model" />
            </SelectTrigger>
            <SelectContent className={`bg-white/5 text-white border border-white/10`}>
              <SelectGroup>
                {modelList.map((model) => (
                  <SelectItem
                    key={model}
                    className="focus:bg-white/10 focus:text-white"
                    value={model}
                  >
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center items-center ml-2 gap-2">
          <Button
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-emerald-500 bg-opacity-90 hover:bg-emerald-600 text-white w-[80px]"
          >
            {saving ? <RiLoader2Line className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}
