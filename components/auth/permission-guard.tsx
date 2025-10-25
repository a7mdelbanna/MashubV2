'use client'

import { useAuth } from '@/contexts/auth-context'
import { PermissionsService, PermissionKey } from '@/lib/services/permissions-service'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'

interface PermissionGuardProps {
  children: ReactNode
  permission?: PermissionKey
  permissions?: PermissionKey[]
  requireAll?: boolean // If true, user must have all permissions. If false, user must have at least one
  fallback?: ReactNode
  redirectTo?: string
  showUnauthorized?: boolean
}

/**
 * Permission Guard Component
 *
 * Protects routes/components based on user permissions
 *
 * Usage:
 * <PermissionGuard permission="write:clients">
 *   <ClientForm />
 * </PermissionGuard>
 *
 * <PermissionGuard permissions={['read:clients', 'write:clients']} requireAll>
 *   <ClientManagement />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback,
  redirectTo,
  showUnauthorized = true
}: PermissionGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check permission
  let hasPermission = false

  if (permission) {
    hasPermission = PermissionsService.hasPermission(user, permission)
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasPermission = PermissionsService.hasAllPermissions(user, permissions)
    } else {
      hasPermission = PermissionsService.hasAnyPermission(user, permissions)
    }
  } else {
    // No permission specified, allow access
    hasPermission = true
  }

  // Handle unauthorized access
  if (!hasPermission) {
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }

    if (fallback) {
      return <>{fallback}</>
    }

    if (showUnauthorized) {
      return <UnauthorizedView />
    }

    return null
  }

  return <>{children}</>
}

/**
 * Default unauthorized view
 */
function UnauthorizedView() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-500/10">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-white transition-all"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Higher-order component for wrapping pages with permission guard
 *
 * Usage:
 * export default withPermission(ClientsPage, 'read:clients')
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: PermissionKey | PermissionKey[],
  options?: {
    requireAll?: boolean
    redirectTo?: string
    fallback?: ReactNode
  }
) {
  return function ProtectedComponent(props: P) {
    if (Array.isArray(permission)) {
      return (
        <PermissionGuard
          permissions={permission}
          requireAll={options?.requireAll}
          redirectTo={options?.redirectTo}
          fallback={options?.fallback}
        >
          <Component {...props} />
        </PermissionGuard>
      )
    }

    return (
      <PermissionGuard
        permission={permission}
        redirectTo={options?.redirectTo}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </PermissionGuard>
    )
  }
}
