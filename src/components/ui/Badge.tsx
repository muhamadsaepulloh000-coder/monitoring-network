import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-[#112E1D] text-[#4ADE80] border border-[#1D5A36]',
    warning: 'bg-[#2D2414] text-[#FBBF24] border border-[#56481E]',
    danger: 'bg-[#2F1212] text-[#F87171] border border-[#5A1F1F]',
    neutral: 'bg-[#171D27] text-slate-300 border border-[#2D3746]',
    info: 'bg-[#12263C] text-[#7CC3FF] border border-[#204B6F]',
  }

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]', variantClasses[variant], className)}>
      {children}
    </span>
  )
}
