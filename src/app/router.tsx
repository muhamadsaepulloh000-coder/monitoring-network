import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { AccessControlPage } from '../features/access-control/AccessControlPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { DeviceDetailsPage } from '../features/devices/DeviceDetailsPage'
import { DevicesPage } from '../features/devices/DevicesPage'
import { LogsPage } from '../features/activity-logs/LogsPage'
import { NetworkMapPage } from '../features/network-map/NetworkMapPage'
import { RouterPage } from '../features/router/RouterPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { TrafficPage } from '../features/traffic/TrafficPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'devices', element: <DevicesPage /> },
        { path: 'devices/:deviceId', element: <DeviceDetailsPage /> },
        { path: 'traffic', element: <TrafficPage /> },
        { path: 'network-map', element: <NetworkMapPage /> },
        { path: 'access-control', element: <AccessControlPage /> },
        { path: 'router', element: <RouterPage /> },
        { path: 'logs', element: <LogsPage /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  {
    basename: '/monitoring-network',
  },
)