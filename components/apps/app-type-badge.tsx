import { AppType } from '@/types'
import { cn } from '@/lib/utils'
import {
  ShoppingBag, Smartphone, Globe, Megaphone,
  Database, FileCode, Package
} from 'lucide-react'

interface AppTypeBadgeProps {
  type: AppType
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showLabel?: boolean
  className?: string
}

const APP_TYPE_CONFIG: Record<AppType, {
  label: string
  icon: typeof ShoppingBag
  gradient: string
  bg: string
  text: string
}> = {
  pos: {
    label: 'POS',
    icon: ShoppingBag,
    gradient: 'from-blue-600 to-cyan-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400'
  },
  mobile_app: {
    label: 'Mobile App',
    icon: Smartphone,
    gradient: 'from-green-600 to-emerald-600',
    bg: 'bg-green-500/10',
    text: 'text-green-400'
  },
  website: {
    label: 'Website',
    icon: Globe,
    gradient: 'from-purple-600 to-pink-600',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400'
  },
  advertising: {
    label: 'Advertising',
    icon: Megaphone,
    gradient: 'from-orange-600 to-red-600',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400'
  },
  crm: {
    label: 'CRM',
    icon: Database,
    gradient: 'from-indigo-600 to-purple-600',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400'
  },
  erp: {
    label: 'ERP',
    icon: Package,
    gradient: 'from-teal-600 to-cyan-600',
    bg: 'bg-teal-500/10',
    text: 'text-teal-400'
  },
  custom: {
    label: 'Custom',
    icon: FileCode,
    gradient: 'from-gray-600 to-slate-600',
    bg: 'bg-gray-500/10',
    text: 'text-gray-400'
  }
}

const SIZE_CONFIG = {
  sm: {
    iconSize: 'h-3 w-3',
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    gap: 'gap-1'
  },
  md: {
    iconSize: 'h-4 w-4',
    padding: 'px-3 py-1',
    text: 'text-sm',
    gap: 'gap-1.5'
  },
  lg: {
    iconSize: 'h-5 w-5',
    padding: 'px-4 py-2',
    text: 'text-base',
    gap: 'gap-2'
  }
}

export function AppTypeBadge({
  type,
  size = 'md',
  showIcon = true,
  showLabel = true,
  className
}: AppTypeBadgeProps) {
  const config = APP_TYPE_CONFIG[type]
  const sizeConfig = SIZE_CONFIG[size]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border font-medium',
        sizeConfig.gap,
        sizeConfig.padding,
        sizeConfig.text,
        config.bg,
        config.text,
        `border-${config.text.replace('text-', '')}/20`,
        className
      )}
    >
      {showIcon && <Icon className={sizeConfig.iconSize} />}
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}

// Gradient icon version for larger displays
export function AppTypeIcon({
  type,
  size = 'md'
}: {
  type: AppType
  size?: 'sm' | 'md' | 'lg'
}) {
  const config = APP_TYPE_CONFIG[type]
  const Icon = config.icon

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-r flex items-center justify-center',
        sizeMap[size],
        config.gradient
      )}
    >
      <Icon className={cn('text-white', iconSizeMap[size])} />
    </div>
  )
}

export { APP_TYPE_CONFIG }
