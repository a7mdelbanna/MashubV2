'use client'

import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionKey } from '@/lib/services/permissions-service'

interface CanProps {
  children: ReactNode
  permission?: PermissionKey
  permissions?: PermissionKey[]
  requireAll?: boolean
  fallback?: ReactNode
}

/**
 * Conditional rendering component based on permissions
 *
 * Usage:
 * <Can permission="write:clients">
 *   <button>Edit Client</button>
 * </Can>
 *
 * <Can permissions={['read:clients', 'write:clients']} requireAll>
 *   <ClientForm />
 * </Can>
 *
 * <Can permission="delete:clients" fallback={<span>Not authorized</span>}>
 *   <button>Delete</button>
 * </Can>
 */
export function Can({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback
}: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let canRender = false

  if (permission) {
    canRender = hasPermission(permission)
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      canRender = hasAllPermissions(permissions)
    } else {
      canRender = hasAnyPermission(permissions)
    }
  } else {
    // No permission specified, allow rendering
    canRender = true
  }

  if (!canRender) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

/**
 * Inverse of Can - renders content when user DOESN'T have permission
 *
 * Usage:
 * <Cannot permission="write:clients">
 *   <p>You cannot edit clients</p>
 * </Cannot>
 */
export function Cannot({
  children,
  permission,
  permissions,
  requireAll = false
}: Omit<CanProps, 'fallback'>) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let canRender = false

  if (permission) {
    canRender = !hasPermission(permission)
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      canRender = !hasAllPermissions(permissions)
    } else {
      canRender = !hasAnyPermission(permissions)
    }
  }

  if (!canRender) {
    return null
  }

  return <>{children}</>
}
