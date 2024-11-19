import { Table, TableRow, TableCell } from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { useEffect, useState } from 'react'
import { Separator } from '@components/ui/separator'
import { IconType } from 'react-icons'
import { useSettingStore } from '@renderer/store/settingStore'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { RiDeleteBin2Line, RiLoader2Line } from 'react-icons/ri'
import Setting from '@renderer/types/setting'

interface PropType {
  title: string
  icon: IconType
}

export const SecretsSettings = ({ title, icon }: PropType) => {
  const { data, getSettingByType, createSetting, updateSetting, deleteSetting } = useSettingStore()
  const [secrets, setSecrets] = useState<Setting[]>([])
  const [saving, setSaving] = useState(false)

  const handleInputChange = (index, field, value) => {
    const newSecrets = [...secrets]
    newSecrets[index][field] = value
    setSecrets(newSecrets)
  }

  useEffect(() => {
    setSecrets(getSettingByType('Secrets'))
  }, [data])

  const addNewRow = () => {
    createSetting({ type: 'Secrets', key: '', value: '', name: '' })
  }

  const handleDelete = (id) => {
    deleteSetting(id)
  }

  const handleSave = () => {
    try {
      setSaving(true)
      secrets.forEach((secret) => {
        updateSetting(secret.id, secret)
      })
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
      <div className="p-10">
        <Table className="min-w-full bg-transparent">
          <TableRow className="bg-white/10 hover:bg-white/20  border-b border-white/20">
            <TableCell className="px-4 py-2 text-left text-white rounded-tl-md">Key</TableCell>
            <TableCell className="px-4 py-2 text-left text-white">Value</TableCell>
            <TableCell className="px-4 py-2 text-left text-white w-[1rem]">Actions</TableCell>
          </TableRow>
          {secrets.map((secret, index) => (
            <TableRow key={index} className="hover:bg-white/5 bg-white/5 border-none">
              <TableCell className="px-4 py-2">
                <Input
                  type="text"
                  value={secret.key}
                  placeholder="Key"
                  onChange={(e) => handleInputChange(index, 'key', e.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-white/30 border border-white/20 rounded-lg px-3 py-2"
                />
              </TableCell>
              <TableCell className="px-4 py-2">
                <Input
                  type="text"
                  value={secret.value}
                  placeholder="Value"
                  onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-white/30 border border-white/20 rounded-lg px-3 py-2"
                />
              </TableCell>
              <TableCell className="px-4 py-2">
                <div className="w-full h-full flex justify-center items-center">
                  <RiDeleteBin2Line
                    className="text-white/70 hover:text-white/90"
                    size={20}
                    onClick={() => handleDelete(secret.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <div className="flex justify-end mt-4 gap-2">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={addNewRow}>
            Add Row
          </Button>
          <Button
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={handleSave}
          >
            {saving && <RiLoader2Line className="animate-spin" />} Save
          </Button>
        </div>
      </div>
    </>
  )
}
