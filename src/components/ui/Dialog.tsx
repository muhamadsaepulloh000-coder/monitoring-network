import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface DialogProps {
  open: boolean
  title: string
  children: ReactNode
  description?: string
  onClose: () => void
  confirmLabel?: string
  onConfirm?: () => void
}

export function Dialog({
  open,
  title,
  children,
  description,
  onClose,
  confirmLabel = 'Confirm',
  onConfirm,
}: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg border border-[#2A3442] bg-[#131A22] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-[#1B222C] hover:text-slate-100" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          {onConfirm ? (
            <Button onClick={() => {
              onConfirm()
              onClose()
            }}>{confirmLabel}</Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
