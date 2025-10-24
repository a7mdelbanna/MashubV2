'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Activity,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SuperAdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || !user.isSuperAdmin)) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user?.isSuperAdmin) {
    return null
  }

  const navItems = [
    { href: '/superadmin', icon: BarChart3, label: 'Dashboard', exact: true },
    { href: '/superadmin/tenants', icon: Building2, label: 'Tenants' },
    { href: '/superadmin/users', icon: Users, label: 'All Users' },
    { href: '/superadmin/activity', icon: Activity, label: 'Activity Logs' },
    { href: '/superadmin/settings', icon: Settings, label: 'Settings' }
  ]

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SuperAdmin</h1>
              <p className="text-xs text-gray-400">System Control</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={signOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-950">{children}</main>
    </div>
  )
}
