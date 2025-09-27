'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  gradient = false,
  onClick
}: GlassCardProps) {
  return (
    <div
      className={cn('group relative', className)}
      onClick={onClick}
    >
      {gradient && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-300" />
      )}
      <div className={cn(
        'relative bg-white/80 dark:bg-gray-800/80',
        'backdrop-blur-xl rounded-xl',
        'border border-white/20 dark:border-gray-700/50',
        hover && 'hover:shadow-xl transform hover:scale-105 transition-all duration-300',
        onClick && 'cursor-pointer'
      )}>
        {children}
      </div>
    </div>
  )
}