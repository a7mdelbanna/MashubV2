'use client'

import { StatsCard } from './stats-card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Metric {
  title: string
  value: string | number
  change?: { value: number; type: 'increase' | 'decrease' }
  icon?: LucideIcon
  color?: 'blue' | 'emerald' | 'purple' | 'orange' | 'red'
}

interface MetricGridProps {
  metrics: Metric[]
  className?: string
  columns?: 2 | 3 | 4
}

export function MetricGrid({ metrics, className, columns = 4 }: MetricGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(`grid ${gridCols[columns]} gap-6`, className)}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <StatsCard
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
          />
        </div>
      ))}
    </div>
  )
}