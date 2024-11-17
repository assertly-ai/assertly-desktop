import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import APIKey from '@renderer/types/apiKey'
interface APIKeyState {
  data: APIKey[]
  setData: (data: APIKey[]) => void
  createAPIKey: (apiKeyData: Omit<APIKey, 'id'>) => Promise<void>
  updateAPIKey: (id: number, APIKeyData: Partial<APIKey>) => Promise<void>
  deleteAPIKey: (id: number) => Promise<void>
  getAPIKey: (id: number) => Promise<APIKey>
  getAPIKeyByName: (name: string) => APIKey
}

export const useAPIKeyStore = createSyncedStore<APIKey, APIKeyState>('APIKeys', (set) => ({
  data: [],
  setData: (data) => set({ data: data.reverse() }),
  createAPIKey: async (apiKeyData) => {
    await window.api.storage.create('APIKeys', apiKeyData)
  },
  updateAPIKey: async (id, apiKeyData) => {
    await window.api.storage.update('APIKeys', id, apiKeyData)
  },
  deleteAPIKey: async (id) => {
    await window.api.storage.delete('APIKeys', id)
  },
  getAPIKey: async (id) => {
    return (await window.api.storage.read('APIKeys', id)) as APIKey
  },
  getAPIKeyByName: async (name) => {
    return useAPIKeyStore.getState().data.find((apiKey) => apiKey.name === name)
  }
}))
