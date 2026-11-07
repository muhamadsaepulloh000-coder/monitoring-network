import { create } from 'zustand'

type ThemeMode = 'dark' | 'light'

interface AppState {
  sidebarCollapsed: boolean
  theme: ThemeMode
  selectedDeviceId: string | null
  notifications: Array<{ id: string; message: string; level: 'info' | 'success' | 'warning' }>
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: ThemeMode) => void
  setSelectedDeviceId: (deviceId: string | null) => void
  addNotification: (message: string, level?: 'info' | 'success' | 'warning') => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  theme: 'dark',
  selectedDeviceId: 'device-1',
  notifications: [
    { id: '1', message: 'Router sync completed successfully.', level: 'success' },
  ],
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
  setSelectedDeviceId: (deviceId) => set({ selectedDeviceId: deviceId }),
  addNotification: (message, level = 'info') =>
    set((state) => ({
      notifications: [...state.notifications, { id: crypto.randomUUID(), message, level }],
    })),
}))
