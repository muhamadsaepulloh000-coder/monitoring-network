import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#3B82F6] text-white hover:bg-[#2E6FDB]',
    secondary: 'bg-[#1B222C] text-slate-100 border border-[#2A3442] hover:bg-[#222C37]',
    ghost: 'bg-transparent text-slate-300 hover:bg-[#161C24]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#E13A3A]',
  }

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-sm',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[10px] border border-transparent font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      {children}
    </button>
  )
}
