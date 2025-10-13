'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Briefcase, DollarSign, Users,
  HeadphonesIcon, GraduationCap, UserPlus, Package,
  Zap, Settings, LogOut, ChevronLeft, Bell,
  Search, Sparkles, Building2, Box, Receipt,
  ShoppingCart, Calendar, Command, HelpCircle, BookOpen,
  ChevronRight, ChevronDown, Kanban, FileText, Shield,
  GitBranch, ClipboardList, Map, Wallet, TrendingUp,
  UserCircle, Tags, Repeat, CheckSquare, BarChart3,
  CreditCard, Coins, MessageSquare, Mail, Target,
  Clock, Star, Lightbulb, Video, CalendarDays,
  PackageOpen, DollarSignIcon, MessageCircle, Layers, FolderTree
} from 'lucide-react'
import { GlobalSearch } from '@/components/search/global-search'

interface SidebarItem {
  name: string
  path: string
  icon: any
  subItems?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Projects',
    path: '/dashboard/projects',
    icon: Briefcase,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/projects', icon: LayoutDashboard },
      { name: 'Board', path: '/dashboard/projects/board', icon: Kanban },
      { name: 'Backlog', path: '/dashboard/projects/backlog', icon: ClipboardList },
      { name: 'Roadmap', path: '/dashboard/projects/roadmap', icon: Map },
      { name: 'Documents', path: '/dashboard/projects/documents', icon: FileText },
      { name: 'Team', path: '/dashboard/projects/team', icon: Users },
      { name: 'Vault', path: '/dashboard/projects/vault', icon: Shield },
      { name: 'Analytics', path: '/dashboard/projects/analytics', icon: BarChart3 },
      { name: 'Time Tracking', path: '/dashboard/projects/time-tracking', icon: Clock },
      { name: 'Resources', path: '/dashboard/projects/resources', icon: Users },
      { name: 'Reports', path: '/dashboard/projects/reports', icon: FileText },
      { name: 'Templates', path: '/dashboard/projects/templates', icon: Layers }
    ]
  },
  {
    name: 'Clients',
    path: '/dashboard/clients',
    icon: Building2,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/clients', icon: LayoutDashboard },
      { name: 'Analytics', path: '/dashboard/clients/analytics', icon: BarChart3 },
      { name: 'Interactions', path: '/dashboard/clients/interactions', icon: MessageSquare },
      { name: 'Deals', path: '/dashboard/clients/deals', icon: Target },
      { name: 'Emails', path: '/dashboard/clients/emails', icon: Mail },
      { name: 'Reports', path: '/dashboard/clients/reports', icon: FileText }
    ]
  },
  { name: 'Invoices', path: '/dashboard/invoices', icon: Receipt },
  {
    name: 'Products',
    path: '/dashboard/products',
    icon: Box,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/products', icon: LayoutDashboard },
      { name: 'Categories', path: '/dashboard/products/categories', icon: FolderTree },
      { name: 'Inventory', path: '/dashboard/products/inventory', icon: PackageOpen },
      { name: 'Analytics', path: '/dashboard/products/analytics', icon: BarChart3 },
      { name: 'Pricing', path: '/dashboard/products/pricing', icon: DollarSign },
      { name: 'Orders', path: '/dashboard/products/orders', icon: ShoppingCart }
    ]
  },
  {
    name: 'Services',
    path: '/dashboard/services',
    icon: Zap,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/services', icon: LayoutDashboard },
      { name: 'Analytics', path: '/dashboard/services/analytics', icon: BarChart3 },
      { name: 'Subscriptions', path: '/dashboard/services/subscriptions', icon: Repeat },
      { name: 'Deliveries', path: '/dashboard/services/deliveries', icon: Package },
      { name: 'Bookings', path: '/dashboard/services/bookings', icon: CalendarDays },
      { name: 'Reviews', path: '/dashboard/services/reviews', icon: Star }
    ]
  },
  {
    name: 'Courses',
    path: '/dashboard/courses',
    icon: BookOpen,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/courses', icon: LayoutDashboard },
      { name: 'Catalog', path: '/dashboard/courses', icon: BookOpen },
      { name: 'Students', path: '/dashboard/courses/students', icon: GraduationCap },
      { name: 'Analytics', path: '/dashboard/courses/analytics', icon: BarChart3 }
    ]
  },
  {
    name: 'Candidates',
    path: '/dashboard/candidates',
    icon: UserPlus,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/candidates', icon: LayoutDashboard },
      { name: 'Positions', path: '/dashboard/candidates/positions', icon: Briefcase },
      { name: 'Analytics', path: '/dashboard/candidates/analytics', icon: BarChart3 },
      { name: 'Interviews', path: '/dashboard/candidates/interviews', icon: Video },
      { name: 'Emails', path: '/dashboard/candidates/emails', icon: Mail },
      { name: 'Reports', path: '/dashboard/candidates/reports', icon: FileText },
      { name: 'Compare', path: '/dashboard/candidates/compare', icon: GitBranch }
    ]
  },
  { name: 'Purchases', path: '/dashboard/purchases', icon: ShoppingCart },
  { name: 'Visits', path: '/dashboard/visits', icon: Calendar },
  {
    name: 'Finance',
    path: '/dashboard/finance',
    icon: DollarSign,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/finance', icon: LayoutDashboard },
      { name: 'Accounts', path: '/dashboard/finance/accounts', icon: Wallet },
      { name: 'Transactions', path: '/dashboard/finance/transactions', icon: TrendingUp },
      { name: 'Categories', path: '/dashboard/finance/categories', icon: Tags },
      { name: 'Contacts', path: '/dashboard/finance/contacts', icon: UserCircle },
      { name: 'Payment Methods', path: '/dashboard/finance/payment-methods', icon: CreditCard },
      { name: 'Recurring', path: '/dashboard/finance/recurring', icon: Repeat },
      { name: 'Reconciliation', path: '/dashboard/finance/reconciliation', icon: CheckSquare },
      { name: 'Reports', path: '/dashboard/finance/reports', icon: BarChart3 },
      { name: 'Settings', path: '/dashboard/finance/settings/currencies', icon: Coins }
    ]
  },
  { name: 'Support', path: '/dashboard/support', icon: HeadphonesIcon },
  {
    name: 'Help',
    path: '/dashboard/help',
    icon: HelpCircle,
    subItems: [
      { name: 'Dashboard', path: '/dashboard/help', icon: LayoutDashboard },
      { name: 'Articles', path: '/dashboard/help/articles', icon: BookOpen },
      { name: 'Tickets', path: '/dashboard/help/tickets', icon: MessageCircle },
      { name: 'Analytics', path: '/dashboard/help/analytics', icon: BarChart3 },
      { name: 'FAQs', path: '/dashboard/help/faqs', icon: Lightbulb }
    ]
  },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings }
]

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Projects'])

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "relative flex flex-col bg-gray-900/80 backdrop-blur-2xl transition-all duration-300 shadow-2xl overflow-visible",
          sidebarCollapsed ? "w-20" : "w-64"
        )}>
          {/* Logo */}
          <div className="h-20 px-6 flex items-center border-b border-gray-800/50">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="text-xl font-bold text-white">MAS</h2>
                  <p className="text-xs text-gray-400">Admin Portal</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.path
              const isExpanded = expandedItems.includes(item.name)
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isChildActive = hasSubItems && item.subItems.some(sub => pathname === sub.path)

              return (
                <div key={item.path}>
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        setExpandedItems(prev =>
                          prev.includes(item.name)
                            ? prev.filter(i => i !== item.name)
                            : [...prev, item.name]
                        )
                      } else {
                        window.location.href = item.path
                      }
                    }}
                    className={cn(
                      "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group",
                      (isActive || isChildActive)
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      sidebarCollapsed ? "mx-auto" : "mr-3"
                    )} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="font-medium flex-1 text-left">{item.name}</span>
                        {hasSubItems && (
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "rotate-90"
                          )} />
                        )}
                      </>
                    )}
                  </button>

                  {/* Sub-items */}
                  {hasSubItems && isExpanded && !sidebarCollapsed && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.path
                        return (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className={cn(
                              "flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                              isSubActive
                                ? "bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-purple-400 border-l-2 border-purple-500"
                                : "text-gray-500 hover:bg-gray-800/30 hover:text-gray-300 hover:translate-x-1"
                            )}
                          >
                            <subItem.icon className="h-4 w-4 mr-2 group-hover:text-purple-400 transition-colors" />
                            <span>{subItem.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800/50">
            {!sidebarCollapsed ? (
              <div className="rounded-xl bg-gradient-to-br from-violet-600/10 to-purple-600/10 border border-violet-500/20 p-4 backdrop-blur-sm">
                <p className="text-xs font-medium text-gray-300 mb-1">MAS Business OS</p>
                <p className="text-xs text-gray-500">Version 1.0.0</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-green-400">System Online</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 animate-pulse" />
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 z-50 group"
          >
            <ChevronLeft className={cn(
              "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
              sidebarCollapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-950/50">
          {/* Header */}
          <header className="h-20 bg-gray-900/40 backdrop-blur-xl border-b border-gray-800/50">
            <div className="h-full flex items-center justify-between px-8">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-purple-500 transition-all group"
                >
                  <Search className="h-5 w-5 text-gray-400 group-hover:text-purple-400" />
                  <span className="text-gray-400 group-hover:text-gray-300">Search...</span>
                  <div className="hidden sm:flex items-center gap-1 ml-8">
                    <kbd className="px-1.5 py-0.5 text-xs text-gray-500 bg-gray-900 rounded">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 text-xs text-gray-500 bg-gray-900 rounded">K</kbd>
                  </div>
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-gray-800 transition-colors">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <button className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      Signed in successfully
                    </button>
                  </div>
                  <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center text-white font-medium">
                    AU
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            {children}
          </main>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}