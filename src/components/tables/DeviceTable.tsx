import type { Device } from '../../types/network'
import { DeviceStatusBadge } from '../network/DeviceStatusBadge'

interface DeviceTableProps {
  data: Device[]
  onSelect?: (device: Device) => void
}

export function DeviceTable({ data, onSelect }: DeviceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#202933] bg-[#10161D]">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-[#0F141A]">
          <tr>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-slate-500">Device</th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-slate-500">IP Address</th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-slate-500">MAC Address</th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-slate-500">Status</th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-slate-500">Connection</th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-slate-500">Download</th>
          </tr>
        </thead>
        <tbody>
          {data.map((device) => (
            <tr key={device.id} className="border-t border-[#202933] hover:bg-[#151D26]" onClick={() => onSelect?.(device)}>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-100">{device.name}</div>
                <div className="text-xs text-slate-400">{device.vendor}</div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-300">{device.ip}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{device.mac}</td>
              <td className="px-4 py-3"><DeviceStatusBadge status={device.status} /></td>
              <td className="px-4 py-3 text-sm text-slate-300">{device.connectionType}</td>
              <td className="px-4 py-3 text-sm text-slate-300">{device.download === null ? '—' : `${device.download} MB`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
