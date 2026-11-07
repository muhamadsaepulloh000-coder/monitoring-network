import { useEffect, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { TrafficChart } from '../../components/charts/TrafficChart'
import { Tabs } from '../../components/ui/Tabs'
import { ErrorState } from '../../components/ui/ErrorState'
import { Skeleton } from '../../components/ui/Skeleton'
import { getTopTrafficDevices, getTrafficSamples } from '../../services/traffic.service'
import type { TrafficSample } from '../../types/network'

const tabItems = [
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
]

export function TrafficPage() {
  const [samples, setSamples] = useState<TrafficSample[]>([])
  const [topDevices, setTopDevices] = useState<Array<{ name: string; value: number }>>([])
  const [activeRange, setActiveRange] = useState('24h')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    Promise.all([getTrafficSamples(), getTopTrafficDevices()])
      .then(([traffic, devices]) => {
        if (active) {
          setSamples(traffic)
          setTopDevices(devices)
        }
      })
      .catch(() => {
        if (active) setError('Traffic analytics could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  if (error) {
    return <ErrorState title="Traffic analytics unavailable" message={error} />
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Analytics</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">Traffic analytics</h2>
        </div>
        <Tabs items={tabItems} value={activeRange} onChange={setActiveRange} />
      </div>

      {loading ? (
        <div className="h-80 rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      ) : (
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <TrafficChart data={samples} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Usage summary</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#202933] bg-[#0D1218] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Peak</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">600 MB</p>
            </div>
            <div className="rounded-lg border border-[#202933] bg-[#0D1218] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Upload</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">112 MB</p>
            </div>
            <div className="rounded-lg border border-[#202933] bg-[#0D1218] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Average</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">406 MB</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Bandwidth ranking</h3>
          <div className="mt-5 space-y-3">
            {topDevices.map((device, index) => (
              <div key={device.name} className="flex items-center justify-between gap-3 rounded-lg border border-[#202933] bg-[#0D1218] p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#12263C] text-xs font-medium text-[#7CC3FF]">#{index + 1}</span>
                  <span className="text-sm text-slate-200">{device.name}</span>
                </div>
                <span className="font-mono text-sm text-slate-300">{device.value} MB</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
