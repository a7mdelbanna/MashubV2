'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Briefcase, DollarSign, Users,
  HeadphonesIcon, GraduationCap, UserPlus, Package,
  Zap, Settings, LogOut, ChevronLeft, Bell,
  Search, Sparkles
} from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/dashboard/projects', icon: Briefcase },
  { name: 'Finance', path: '/dashboard/finance', icon: DollarSign },
  { name: 'CRM', path: '/dashboard/crm', icon: Users },
  { name: 'Support', path: '/dashboard/support', icon: HeadphonesIcon },
  { name: 'Learning', path: '/dashboard/learning', icon: GraduationCap },
  { name: 'Human Resources', path: '/dashboard/hr', icon: UserPlus },
  { name: 'Assets', path: '/dashboard/assets', icon: Package },
  { name: 'Automations', path: '/dashboard/automations', icon: Zap },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings }
]

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={cn(
          "relative flex flex-col bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}>
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
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
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    sidebarCollapsed ? "mx-auto" : "mr-3"
                  )} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800">
            {!sidebarCollapsed ? (
              <div className="rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 p-4">
                <p className="text-xs text-gray-400 mb-2">MAS Business OS</p>
                <p className="text-xs text-gray-500">v1.0</p>
                <p className="text-xs text-green-400 mt-2">System performing optimally</p>
              </div>
            ) : (
              <div className="w-full h-12 rounded-xl gradient-purple animate-pulse-glow" />
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
          >
            <ChevronLeft className={cn(
              "h-3 w-3 transition-transform",
              sidebarCollapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gray-900/30 backdrop-blur-xl border-b border-gray-800">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

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

            {/* Welcome Message */}
            <div className="px-6 pb-4">
              <p className="text-gray-400 text-sm">Welcome back, Admin User!</p>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}