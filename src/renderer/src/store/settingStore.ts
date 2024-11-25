import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import Setting from '@renderer/types/setting'
interface SettingState {
  data: Setting[]
  setData: (data: Setting[]) => void
  createSetting: (SettingData: Omit<Setting, 'id'>) => Promise<void>
  updateSetting: (id: number, SettingData: Partial<Setting>) => Promise<void>
  deleteSetting: (id: number) => Promise<void>
  getSetting: (id: number) => Promise<Setting>
  getSettingByName: (name: string) => Setting
  getSettingByType: (type: string) => Setting[]
  getSettingByKey: (key: string) => Setting
}

export const useSettingStore = createSyncedStore<Setting, SettingState>('Settings', (set) => ({
  data: [],
  setData: (data) => set({ data: data.reverse() }),
  createSetting: async (settingData) => {
    await window.api.storage.create('Settings', settingData)
  },
  updateSetting: async (id, settingData) => {
    await window.api.storage.update('Settings', id, settingData)
  },
  deleteSetting: async (id) => {
    await window.api.storage.delete('Settings', id)
  },
  getSetting: async (id) => {
    return (await window.api.storage.read('Settings', id)) as Setting
  },
  getSettingByName: (name) => {
    return useSettingStore.getState().data.find((settingData) => settingData.name === name)
  },
  getSettingByType: (type) => {
    return useSettingStore
      .getState()
      .data.filter((settingData) => settingData.type === type)
      .reverse()
  },
  getSettingByKey: (key) => {
    return useSettingStore.getState().data.find((settingData) => settingData.key === key)
  }
}))
