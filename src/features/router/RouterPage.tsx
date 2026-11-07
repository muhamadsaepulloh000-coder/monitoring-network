import { Cpu, MemoryStick, Router as RouterIcon, Wifi, Signal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { RouterStatus } from '../../components/network/RouterStatus'
import { ErrorState } from '../../components/ui/ErrorState'
import { getRouterDetails } from '../../services/router.service'
import type { Router } from '../../types/network'

export function RouterPage() {
  const [router, setRouter] = useState<Router | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getRouterDetails()
      .then((details) => {
        if (active) setRouter(details)
      })
      .catch(() => {
        if (active) setError('Router details could not be loaded.')
      })

    return () => { active = false }
  }, [])

  if (error) {
    return <ErrorState title="Router unavailable" message={error} />
  }

  if (!router) {
    return <div className="rounded-xl border border-[#202933] bg-[#10161D] p-8 text-sm text-slate-400">Loading router details…</div>
  }

  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gateway</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-100">Router management</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <RouterStatus router={router} />

        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">System overview</h3>
          <dl className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><RouterIcon size={15} /> Model</span><span>{router.model}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Cpu size={15} /> Hardware</span><span>{router.hardwareVersion}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><MemoryStick size={15} /> Firmware</span><span>{router.firmwareVersion}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Signal size={15} /> Gateway</span><span className="font-mono text-xs">{router.gatewayIp}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Wifi size={15} /> Uptime</span><span>{router.uptime}</span></div>
          </dl>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">WAN</p>
          <p className="mt-3 text-xl font-semibold text-slate-100">{router.wanStatus}</p>
        </div>
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">WLAN</p>
          <p className="mt-3 text-xl font-semibold text-slate-100">{router.wlanStatus}</p>
        </div>
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">LAN</p>
          <p className="mt-3 text-xl font-semibold text-slate-100">{router.lanStatus}</p>
        </div>
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Optical</p>
          <p className="mt-3 text-sm text-slate-100">{router.opticalInfo}</p>
        </div>
      </div>
    </PageContainer>
  )
}
