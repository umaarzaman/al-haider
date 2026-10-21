import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'red' | 'green' | 'gray'
  className?: string
}

export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  const variants = {
    gold: 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30',
    red: 'bg-red-500/20 text-red-400 border border-red-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    gray: 'bg-white/10 text-white/70 border border-white/20',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
