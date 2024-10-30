import { create } from 'zustand'

type PanelStoreState = {
  currentPanel: string
  setCurrentPanel: (panel: string) => void
}

export const usePanelStore = create<PanelStoreState>((set) => ({
  currentPanel: 'scripts',
  setCurrentPanel: (panel: string) =>
    set({
      currentPanel: panel
    })
}))
