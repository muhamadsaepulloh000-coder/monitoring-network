import type { ActivityLog } from '../../types/network'

export function ActivityTimeline({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
          <div className="flex-1 border-b border-[#202933] pb-4 last:border-none last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-100">{log.description}</p>
              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{log.type}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>{log.timestamp}</span>
              <span>•</span>
              <span>{log.device}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
