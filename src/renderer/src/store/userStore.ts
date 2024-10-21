import { createSyncedStore } from '@renderer/lib/createSyncedStore'

interface User {
  id: number
  username: string
  email: string
}

interface UserState {
  data: User[]
  currentUser: User | null
  setData: (data: User[]) => void
  setCurrentUser: (user: User | null) => void
  createUser: (userData: Omit<User, 'id'>) => Promise<void>
  updateUser: (id: number, userData: Partial<User>) => Promise<void>
  deleteUser: (id: number) => Promise<void>
}

export const useUserStore = createSyncedStore<User, UserState>('Users', (set) => ({
  data: [],
  currentUser: null,
  setData: (data) => set({ data }),
  setCurrentUser: (user) => set({ currentUser: user }),
  createUser: async (userData) => {
    await window.api.storage.create('Users', userData)
  },
  updateUser: async (id, userData) => {
    await window.api.storage.update('Users', id, userData)
  },
  deleteUser: async (id) => {
    await window.api.storage.delete('Users', id)
  }
}))
