export type DeviceStatus = 'online' | 'offline' | 'sleeping' | 'blocked';
export type AccessStatus = 'Authorized' | 'Blocked' | 'Pending';
export type ConnectionType = 'Wi‑Fi' | 'Ethernet' | 'Unknown';
export type EventType = 'Security' | 'System' | 'Traffic' | 'Device' | 'Maintenance';

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  connectionType: ConnectionType;
  status: DeviceStatus;
  vendor: string;
  model: string | null;
  os: string | null;
  gateway: string | null;
  lastSeen: string;
  bandwidth: number | null;
  upload: number | null;
  download: number | null;
  accessStatus: AccessStatus | null;
  lastActive: string | null;
  notes: string | null;
}

export interface Router {
  model: string;
  hardwareVersion: string;
  firmwareVersion: string;
  gatewayIp: string;
  cpuUsage: number;
  memoryUsage: number;
  wanStatus: 'Connected' | 'Disconnected';
  wlanStatus: 'Online' | 'Offline';
  lanStatus: 'Online' | 'Offline';
  opticalInfo: string;
  uptime: string;
  connections: number;
}

export interface TrafficSample {
  time: string;
  upload: number;
  download: number;
}

export interface DeviceSession {
  id: string;
  start: string;
  end: string;
  duration: string;
  ip: string;
  status: DeviceStatus;
}

export interface AccessControl {
  id: string;
  name: string;
  ip: string;
  mac: string;
  status: AccessStatus;
  policy: 'Trusted' | 'Restricted' | 'Monitor';
  lastSeen: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: EventType;
  description: string;
  device: string;
  administrator: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DashboardSummary {
  routerConnected: boolean;
  onlineDevices: number;
  offlineDevices: number;
  totalDevices: number;
  averageDownload: number;
  averageUpload: number;
  networkHealth: number;
  currentAlerts: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'internet' | 'router' | 'wifi' | 'ethernet' | 'device';
  status: 'online' | 'offline';
}
