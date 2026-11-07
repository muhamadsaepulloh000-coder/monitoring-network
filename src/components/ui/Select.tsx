import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-300">
      {label ? <span>{label}</span> : null}
      <select
        className={cn(
          'h-10 rounded-md border border-[#2A3442] bg-[#0D1117] px-3 text-sm text-slate-100 focus:border-[#3B82F6] focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
