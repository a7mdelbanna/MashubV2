'use client'

import { LucideIcon, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: LucideIcon
  gradient: string
  delay?: number
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  gradient,
  delay = 0
}: MetricCardProps) {
  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative group">
        {/* Background Glow */}
        <div className={cn(
          "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500",
          gradient
        )} />

        {/* Card */}
        <div className="relative h-full rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 transition-all duration-300 group-hover:bg-gray-900/70">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-3 rounded-xl",
              gradient
            )}>
              {Icon && <Icon className="h-6 w-6 text-white" />}
            </div>

            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                change.type === 'increase' ? "text-green-400" : "text-red-400"
              )}>
                {change.type === 'increase' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{change.value}%</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            {subtitle && (
              <p className="text-gray-500 text-xs">{subtitle}</p>
            )}
          </div>

          {/* Progress Bar (optional) */}
          {change && (
            <div className="mt-4">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    gradient
                  )}
                  style={{ width: `${Math.min(100, Math.abs(change.value) * 10)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}