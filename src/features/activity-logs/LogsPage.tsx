import { useEffect, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/ErrorState'
import { Select } from '../../components/ui/Select'
import { getActivityLogs } from '../../services/activity-log.service'
import type { ActivityLog } from '../../types/network'

export function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getActivityLogs()
      .then((entries) => {
        if (active) setLogs(entries)
      })
      .catch(() => {
        if (active) setError('Activity history could not be loaded.')
      })

    return () => { active = false }
  }, [])

  if (error) {
    return <ErrorState title="Activity log unavailable" message={error} />
  }

  const visibleLogs = typeFilter === 'all' ? logs : logs.filter((log) => log.type === typeFilter)

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Audit</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">Activity logs</h2>
        </div>
        <div className="flex items-center gap-3">
          <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-40">
            <option value="all">All events</option>
            <option value="Traffic">Traffic</option>
            <option value="Device">Device</option>
            <option value="Security">Security</option>
            <option value="System">System</option>
          </Select>
          <Button variant="secondary">Export</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#202933] bg-[#10161D]">
        <table className="min-w-full text-left">
          <thead className="bg-[#0F141A]">
            <tr>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-slate-500">Timestamp</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-slate-500">Type</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-slate-500">Description</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-slate-500">Related device</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-slate-500">Administrator</th>
            </tr>
          </thead>
          <tbody>
            {visibleLogs.map((log) => (
              <tr key={log.id} className="border-t border-[#202933]">
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{log.timestamp}</td>
                <td className="px-4 py-3 text-sm text-slate-200">{log.type}</td>
                <td className="px-4 py-3 text-sm text-slate-200">{log.description}</td>
                <td className="px-4 py-3 text-sm text-slate-200">{log.device}</td>
                <td className="px-4 py-3 text-sm text-slate-200">{log.administrator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  )
}
