import { Activity, BarChart3, HardDrive, Router, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TrafficChart } from '../../components/charts/TrafficChart'
import { ActivityTimeline } from '../../components/network/ActivityTimeline'
import { RouterStatus } from '../../components/network/RouterStatus'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { activityLogs, router, trafficSamples } from '../../data/mockData'
import { discoverDevices } from '../../services/device.service'
import { useAppStore } from '../../stores/app-store'
import type { Device } from '../../types/network'

const summaryCards = [{
  title: 'Router status',
  value: 'Connected',
  meta: 'Gateway active',
  icon: Router,
}, {
  title: 'Connected devices',
  value: '4 online',
  meta: '2 offline',
  icon: HardDrive,
}, {
  title: 'Download',
  value: '406 MB/s',
  meta: 'Avg throughput',
  icon: BarChart3,
}, {
  title: 'Safety scan',
  value: '93%',
  meta: 'Network health',
  icon: ShieldCheck,
}]

export function DashboardPage() {
  const [devicePreview, setDevicePreview] = useState<Device[]>([])
  const [devicePreviewError, setDevicePreviewError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const addNotification = useAppStore((state) => state.addNotification)

  useEffect(() => {
    let active = true

    discoverDevices()
      .then((discoveredDevices) => {
        if (active) setDevicePreview(discoveredDevices)
      })
      .catch((cause: unknown) => {
        if (active) setDevicePreviewError(cause instanceof Error ? cause.message : 'Device discovery is unavailable.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const handleRefreshSnapshot = async () => {
    setLoading(true)
    setDevicePreviewError(null)
    try {
      const discoveredDevices = await discoverDevices()
      setDevicePreview(discoveredDevices)
      setLoading(false)
      addNotification(`Local scan complete: ${discoveredDevices.length} device(s) observed.`, 'success')
    } catch (cause) {
      setLoading(false)
      const message = cause instanceof Error ? cause.message : 'Local network scan failed.'
      setDevicePreviewError(message)
      addNotification(message, 'warning')
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">Network overview</h2>
        </div>
        <Button variant="secondary" onClick={handleRefreshSnapshot}>Refresh snapshot</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ title, value, meta, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-[#202933] bg-[#10161D] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.14em] text-slate-500">{title}</span>
                <span className="rounded-md bg-[#121A22] p-2 text-[#3B82F6]"><Icon size={16} /></span>
              </div>
              <div className="mt-4 text-2xl font-semibold text-slate-100">
                {title === 'Connected devices'
                  ? devicePreviewError ? 'Unavailable' : `${devicePreview.filter((device) => device.status === 'online').length} online`
                  : value}
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {title === 'Connected devices'
                  ? devicePreviewError ?? `${devicePreview.filter((device) => device.status === 'offline').length} offline · ${devicePreview.length} total`
                  : meta}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Traffic</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-100">Upload and download</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />Download</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />Upload</span>
            </div>
          </div>
          <TrafficChart data={trafficSamples} />
        </div>

        <div className="space-y-6">
          <RouterStatus router={router} />
          <div className="rounded-lg border border-[#202933] bg-[#10161D] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Router health</h3>
              <span className="text-xs uppercase tracking-[0.12em] text-[#22C55E]">Stable</span>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>CPU usage</span><span className="font-medium">46%</span></div>
              <div className="flex items-center justify-between"><span>Memory</span><span className="font-medium">62%</span></div>
              <div className="flex items-center justify-between"><span>Uptime</span><span className="font-medium">6d 04h</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Connected device preview</h3>
            <span className="text-xs uppercase tracking-[0.12em] text-slate-500">{devicePreview.length} discovered</span>
          </div>
          <div className="space-y-3">
            {devicePreview.slice(0, 3).map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-lg border border-[#202933] bg-[#0D1218] p-3">
                <div>
                  <p className="font-medium text-slate-100">{device.name}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">{device.ip}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">{device.mac}</p>
                  <p className="text-xs text-slate-500">{device.status}</p>
                </div>
              </div>
            ))}
            {devicePreview.length === 0 ? (
              <p className="text-sm text-slate-400">{devicePreviewError ?? 'No devices have been discovered yet.'}</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border border-[#202933] bg-[#10161D] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Recent network events</h3>
            <Activity size={16} className="text-slate-400" />
          </div>
          <ActivityTimeline logs={activityLogs.slice(0, 4)} />
        </div>
      </div>
    </PageContainer>
  )
}
