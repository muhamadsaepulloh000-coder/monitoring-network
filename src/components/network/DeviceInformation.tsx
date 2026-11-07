import type { Device } from '../../types/network'
import { DeviceStatusBadge } from './DeviceStatusBadge'

export function DeviceInformation({ device }: { device: Device }) {
  return (
    <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Device identity</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-100">{device.name}</h3>
        </div>
        <DeviceStatusBadge status={device.status} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">IP</dt>
          <dd className="mt-1 font-mono text-sm text-slate-200">{device.ip}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">MAC</dt>
          <dd className="mt-1 font-mono text-sm text-slate-200">{device.mac}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Vendor</dt>
          <dd className="mt-1 text-sm text-slate-200">{device.vendor}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">OS</dt>
          <dd className="mt-1 text-sm text-slate-200">{device.os ?? 'Unknown'}</dd>
        </div>
      </dl>
    </div>
  )
}
