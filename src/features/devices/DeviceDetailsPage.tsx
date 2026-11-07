import { Clock3, Cpu, Globe, Shield, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { DeviceInformation } from '../../components/network/DeviceInformation'
import { DeviceStatusBadge } from '../../components/network/DeviceStatusBadge'
import { Button } from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/ErrorState'
import { Skeleton } from '../../components/ui/Skeleton'
import { getDeviceById } from '../../services/device.service'
import type { Device } from '../../types/network'

export function DeviceDetailsPage() {
  const { deviceId } = useParams()
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId) {
      setError('No device ID provided for the details view.')
      setLoading(false)
      return
    }

    let active = true

    getDeviceById(deviceId)
      .then((deviceData) => {
        if (active) {
          setDevice(deviceData)
          if (!deviceData) setError('This device is not present in the registry. Run a local network scan and try again.')
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Device details could not be retrieved.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [deviceId])

  if (error) {
    return <ErrorState title="Device details unavailable" message={error} />
  }

  if (loading || !device) {
    return <Skeleton className="h-72 rounded-xl" />
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Identity</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">{device.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <DeviceStatusBadge status={device.status} />
          <Button variant="secondary">Manage access</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DeviceInformation device={device} />

        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Network information</h3>
          <dl className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Wifi size={15} /> Connection</span><span>{device.connectionType}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Globe size={15} /> Gateway</span><span>{device.gateway ?? 'Unknown'}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock3 size={15} /> Last seen</span><span>{device.lastSeen}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Shield size={15} /> Access</span><span>{device.accessStatus ?? 'Not configured'}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Cpu size={15} /> Bandwidth</span><span>{device.bandwidth === null ? 'Not measured' : `${device.bandwidth}%`}</span></div>
          </dl>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Connection history</h3>
          <p className="mt-4 text-sm text-slate-400">Session history is not collected by local network discovery.</p>
        </div>

        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Traffic history</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#202933] bg-[#0D1218] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Upload</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{device.upload === null ? 'Not collected' : `${device.upload} MB`}</p>
            </div>
            <div className="rounded-lg border border-[#202933] bg-[#0D1218] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Download</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{device.download === null ? 'Not collected' : `${device.download} MB`}</p>
            </div>
            <div className="rounded-lg border border-[#202933] bg-[#0D1218] p-3 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Notes</p>
              <p className="mt-2 text-sm text-slate-300">{device.notes ?? 'No notes recorded.'}</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
