import { dashboardSummary } from '../data/mockData'
import { apiRequest } from './api-client'
import type { DashboardSummary, Device } from '../types/network'

interface ApiDevice {
  id: string
  ip: string
  mac: string | null
  hostname: string | null
  isOnline: boolean
  lastSeen: string
}

function toDevice(device: ApiDevice): Device {
  const lastSeen = new Date(device.lastSeen)
  return {
    id: device.id,
    name: device.hostname || device.ip,
    ip: device.ip,
    mac: device.mac || 'Unknown',
    connectionType: 'Unknown',
    status: device.isOnline ? 'online' : 'offline',
    vendor: 'Unknown',
    model: null,
    os: null,
    gateway: null,
    lastSeen: Number.isNaN(lastSeen.getTime()) ? 'Unknown' : lastSeen.toLocaleString(),
    bandwidth: null,
    upload: null,
    download: null,
    accessStatus: null,
    lastActive: null,
    notes: null,
  }
}

export const getDevices = async (): Promise<Device[]> => {
  const devices = await apiRequest<ApiDevice[]>('/devices')
  return devices.map(toDevice)
}

export const discoverDevices = async (): Promise<Device[]> => {
  const devices = await apiRequest<ApiDevice[]>('/devices/discover', { method: 'POST' })
  return devices.map(toDevice)
}

export const getDeviceById = async (deviceId: string): Promise<Device | null> => {
  try {
    const device = await apiRequest<ApiDevice>(`/devices/${encodeURIComponent(deviceId)}`)
    return toDevice(device)
  } catch (error) {
    if (error instanceof Error && error.message.includes('HTTP 404')) return null
    throw error
  }
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 180))
  return dashboardSummary
}
