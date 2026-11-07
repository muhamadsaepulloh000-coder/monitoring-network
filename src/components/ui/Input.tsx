import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-300">
      {label ? <span>{label}</span> : null}
      <input
        className={cn(
          'h-10 rounded-md border border-[#2A3442] bg-[#0D1117] px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#3B82F6] focus:outline-none',
          className,
        )}
        {...props}
      />
    </label>
  )
}
