import type { DeviceStatus } from '../../types/network'
import { Badge } from '../ui/Badge'

interface DeviceStatusBadgeProps {
  status: DeviceStatus
}

export function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  const labelMap: Record<DeviceStatus, { text: string; variant: 'success' | 'neutral' | 'warning' | 'danger' }> = {
    online: { text: 'Online', variant: 'success' },
    offline: { text: 'Offline', variant: 'neutral' },
    sleeping: { text: 'Sleeping', variant: 'warning' },
    blocked: { text: 'Blocked', variant: 'danger' },
  }

  const config = labelMap[status]

  return <Badge variant={config.variant}>{config.text}</Badge>
}
