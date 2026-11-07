import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface TabItem {
  label: string
  value: string
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-[#2A3442] bg-[#10161D] p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm transition-colors',
            value === item.value ? 'bg-[#1B222C] text-slate-100' : 'text-slate-400 hover:text-slate-200',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ children, active }: { children: ReactNode; active: boolean }) {
  if (!active) return null
  return <div>{children}</div>
}
