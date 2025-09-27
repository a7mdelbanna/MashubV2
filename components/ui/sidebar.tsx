'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react'

export interface SidebarItem {
  name: string
  path: string
  icon: LucideIcon
  badge?: number | string
  children?: SidebarItem[]
}

interface SidebarProps {
  items: SidebarItem[]
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ items, collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  const isActive = (path: string) => pathname === path
  const isParentActive = (item: SidebarItem) => {
    if (item.children) {
      return item.children.some(child => pathname === child.path)
    }
    return false
  }

  return (
    <div className={cn(
      "relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
      "border-r border-white/20 dark:border-gray-700/50",
      "transition-all duration-300",
      collapsed ? "w-20" : "w-64",
      mounted ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Collapse Button */}
      <button
        onClick={() => onCollapse?.(!collapsed)}
        className="absolute -right-3 top-8 z-10 p-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      <nav className="p-4 space-y-2">
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.path)
          const active = isActive(item.path) || isParentActive(item)

          return (
            <div key={item.path}>
              {hasChildren ? (
                // Parent Item with Children
                <button
                  onClick={() => toggleExpanded(item.path)}
                  className={cn(
                    "w-full flex items-center justify-between",
                    "px-4 py-3 rounded-lg",
                    "transition-all duration-300",
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      collapsed && "mx-auto"
                    )} />
                    {!collapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isExpanded && "rotate-90"
                    )} />
                  )}
                </button>
              ) : (
                // Regular Item
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center justify-between",
                    "px-4 py-3 rounded-lg",
                    "transition-all duration-300",
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      collapsed && "mx-auto"
                    )} />
                    {!collapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </div>
                  {!collapsed && item.badge && (
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}

              {/* Children Items */}
              {hasChildren && isExpanded && !collapsed && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      href={child.path}
                      className={cn(
                        "flex items-center justify-between",
                        "px-4 py-2 rounded-lg text-sm",
                        "transition-all duration-300",
                        isActive(child.path)
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </div>
                      {child.badge && (
                        <span className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          isActive(child.path)
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        )}>
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}