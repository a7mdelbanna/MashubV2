'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick?: () => void
  gradient?: string
  delay?: number
  className?: string
  badge?: string
  badgeColor?: string
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  gradient = 'from-blue-500 to-purple-600',
  delay = 0,
  className,
  badge,
  badgeColor = 'bg-blue-600'
}: ActionCardProps) {
  return (
    <div
      className={cn(
        "group relative animate-fade-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>

      <button
        onClick={onClick}
        className="relative w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/50 p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-left"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {badge && (
            <span className={`px-2 py-1 rounded-full text-xs text-white ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </button>
    </div>
  )
}