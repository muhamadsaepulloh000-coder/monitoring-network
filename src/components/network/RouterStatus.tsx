import type { Router } from '../../types/network'
import { Badge } from '../ui/Badge'

export function RouterStatus({ router }: { router: Router }) {
  return (
    <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gateway</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-100">{router.model}</h3>
        </div>
        <Badge variant="success">Connected</Badge>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">CPU</dt>
          <dd className="mt-1 text-sm text-slate-200">{router.cpuUsage}%</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Memory</dt>
          <dd className="mt-1 text-sm text-slate-200">{router.memoryUsage}%</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">WAN</dt>
          <dd className="mt-1 text-sm text-slate-200">{router.wanStatus}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">WLAN</dt>
          <dd className="mt-1 text-sm text-slate-200">{router.wlanStatus}</dd>
        </div>
      </dl>
    </div>
  )
}
