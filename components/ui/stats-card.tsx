'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: LucideIcon
  color?: 'blue' | 'emerald' | 'purple' | 'orange' | 'red'
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue'
}: StatsCardProps) {
  const colorMap = {
    blue: 'from-blue-600 to-indigo-600',
    emerald: 'from-emerald-600 to-green-600',
    purple: 'from-purple-600 to-pink-600',
    orange: 'from-orange-600 to-red-600',
    red: 'from-red-600 to-rose-600'
  }

  const bgColorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    orange: 'bg-orange-100 dark:bg-orange-900/30',
    red: 'bg-red-100 dark:bg-red-900/30'
  }

  const textColorMap = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  }

  return (
    <div className="group relative">
      <div className={cn(
        'absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur transition duration-300',
        colorMap[color]
      )}></div>
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <p className={cn('text-2xl font-bold', textColorMap[color])}>{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {change.type === 'increase' ? (
                  <TrendingUp className={cn('h-4 w-4 mr-1', textColorMap[color])} />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={cn(
                  'text-sm',
                  change.type === 'increase' ? textColorMap[color] : 'text-red-600'
                )}>
                  {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn('p-3 rounded-xl', bgColorMap[color])}>
              <Icon className={cn('h-6 w-6', textColorMap[color])} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}