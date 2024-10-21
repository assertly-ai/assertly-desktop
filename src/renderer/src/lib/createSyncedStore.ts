import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand'

type SyncedState<T> = {
  data: T[]
  setData: (data: T[]) => void
}

export function createSyncedStore<T extends { id: number }, U extends SyncedState<T>>(
  tableName: string,
  stateCreator: StateCreator<U>
): UseBoundStore<StoreApi<U>> {
  return create<U>((set, get, api) => {
    const syncData = async () => {
      const data = (await window.api.storage.list(tableName)) as T[]
      get().setData(data)
    }

    // Start syncing immediately
    syncData()

    // Listen for updates
    window.electron.ipcRenderer.on('sync-data', (_, changedTable) => {
      if (changedTable === tableName) {
        syncData()
      }
    })

    return {
      ...stateCreator(set, get, api),
      syncData
    }
  })
}
