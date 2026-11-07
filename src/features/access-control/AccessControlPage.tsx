import { useEffect, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { Dialog } from '../../components/ui/Dialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { getAccessControls } from '../../services/access-control.service'
import type { AccessControl } from '../../types/network'

export function AccessControlPage() {
  const [items, setItems] = useState<AccessControl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<AccessControl | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    let active = true

    getAccessControls()
      .then((accessList) => {
        if (active) setItems(accessList)
      })
      .catch(() => {
        if (active) setError('Access control list could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  if (error) {
    return <ErrorState title="Access control unavailable" message={error} />
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Policy</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">Access control</h2>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[#202933] bg-[#10161D] p-8 text-sm text-slate-400">Loading access policy…</div>
      ) : items.length === 0 ? (
        <EmptyState title="No access policies available" description="This section will update when managed devices are available." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{item.name}</h3>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">{item.ip}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${item.status === 'Blocked' ? 'border-[#5A1F1F] bg-[#2F1212] text-[#F87171]' : item.status === 'Pending' ? 'border-[#56481E] bg-[#2D2414] text-[#FBBF24]' : 'border-[#1D5A36] bg-[#112E1D] text-[#4ADE80]'}`}>
                  {item.status}
                </span>
              </div>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">MAC</dt>
                  <dd className="mt-1 font-mono text-xs text-slate-200">{item.mac}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Policy</dt>
                  <dd className="mt-1 text-slate-200">{item.policy}</dd>
                </div>
              </dl>
              <div className="mt-5 flex justify-end gap-2">
                {item.status === 'Blocked' ? (
                  <Button variant="secondary" onClick={() => { setSelected(item); setDialogOpen(true) }}>Restore access</Button>
                ) : (
                  <Button variant="secondary" onClick={() => { setSelected(item); setDialogOpen(true) }}>Review access</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        title={selected?.status === 'Blocked' ? 'Restore device access' : 'Review device access'}
        description="This is a UI confirmation flow only. No backend request is executed in this frontend." 
        onClose={() => setDialogOpen(false)}
        confirmLabel={selected?.status === 'Blocked' ? 'Restore access' : 'Apply policy'}
        onConfirm={() => {
          if (!selected) return
          setItems((current) => current.map((item) => (item.id === selected.id ? { ...item, status: selected.status === 'Blocked' ? 'Authorized' : 'Blocked' } : item)))
        }}
      >
        <p className="text-sm text-slate-300">
          {selected ? `Confirm the action for ${selected.name} (${selected.ip}).` : 'No device selected.'}
        </p>
      </Dialog>
    </PageContainer>
  )
}
