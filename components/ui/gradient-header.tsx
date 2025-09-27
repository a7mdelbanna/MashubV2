'use client'

import { ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface GradientHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  children?: ReactNode
  className?: string
}

export function GradientHeader({
  title,
  subtitle,
  icon: Icon,
  gradientFrom = 'from-blue-600',
  gradientVia = 'via-purple-600',
  gradientTo = 'to-emerald-600',
  children,
  className
}: GradientHeaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn(
      'transition-all duration-700',
      mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0',
      className
    )}>
      <div className={cn(
        'relative overflow-hidden rounded-3xl',
        `bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} p-[1px]`
      )}>
        <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 opacity-50"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              {Icon && (
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Icon className="h-8 w-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {children && (
              <div className="mt-6">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}