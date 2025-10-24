/**
 * Permissions & Access Control System
 * Role-based access control for agile work items, projects, and files
 */

import { WorkItemType } from './agile'

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

/**
 * Resource types that can have permissions
 */
export type Resource =
  | 'project'
  | 'epic'
  | 'story'
  | 'task'
  | 'sprint'
  | 'backlog'
  | 'board'
  | 'checklist'
  | 'file'
  | 'comment'
  | 'time_entry'
  | 'custom_field'

/**
 * Actions that can be performed on resources
 */
export type Action =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'assign'
  | 'unassign'
  | 'complete'
  | 'reopen'
  | 'comment'
  | 'attach'
  | 'move' // Move between sprints/epics
  | 'estimate' // Set story points/time estimates
  | 'approve' // Approve work items
  | 'manage' // Full management rights

/**
 * Permission string format: "resource:action"
 * Examples: "task:edit", "project:delete", "sprint:create"
 */
export type Permission = `${Resource}:${Action}`

// ============================================================================
// ROLES
// ============================================================================

export type RoleName =
  | 'project_manager'
  | 'product_owner'
  | 'scrum_master'
  | 'team_lead'
  | 'developer'
  | 'designer'
  | 'qa_engineer'
  | 'stakeholder'
  | 'viewer'

export interface Role {
  id: string
  name: RoleName
  displayName: string
  description: string
  permissions: Permission[]
  isCustom: boolean
  createdAt?: Date
}

// ============================================================================
// PREDEFINED ROLES WITH PERMISSIONS
// ============================================================================

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  project_manager: [
    // Full project access
    'project:view', 'project:edit', 'project:delete', 'project:manage',

    // Full epic access
    'epic:view', 'epic:create', 'epic:edit', 'epic:delete', 'epic:assign',

    // Full story access
    'story:view', 'story:create', 'story:edit', 'story:delete', 'story:assign', 'story:estimate', 'story:approve',

    // Full task access
    'task:view', 'task:create', 'task:edit', 'task:delete', 'task:assign', 'task:complete',

    // Full sprint access
    'sprint:view', 'sprint:create', 'sprint:edit', 'sprint:delete', 'sprint:manage',

    // Full backlog access
    'backlog:view', 'backlog:edit', 'backlog:manage',

    // Board access
    'board:view', 'board:edit', 'board:manage',

    // Checklist access
    'checklist:view', 'checklist:edit', 'checklist:complete',

    // File access
    'file:view', 'file:create', 'file:edit', 'file:delete', 'file:attach',

    // Comment access
    'comment:view', 'comment:create', 'comment:edit', 'comment:delete',

    // Time tracking
    'time_entry:view', 'time_entry:create', 'time_entry:edit', 'time_entry:approve'
  ],

  product_owner: [
    'project:view', 'project:edit',
    'epic:view', 'epic:create', 'epic:edit', 'epic:assign',
    'story:view', 'story:create', 'story:edit', 'story:assign', 'story:estimate', 'story:approve',
    'task:view', 'task:create', 'task:assign',
    'sprint:view', 'sprint:edit',
    'backlog:view', 'backlog:edit', 'backlog:manage',
    'board:view',
    'checklist:view',
    'file:view', 'file:create', 'file:attach',
    'comment:view', 'comment:create', 'comment:edit'
  ],

  scrum_master: [
    'project:view',
    'epic:view',
    'story:view', 'story:assign', 'story:estimate',
    'task:view', 'task:assign',
    'sprint:view', 'sprint:create', 'sprint:edit', 'sprint:manage',
    'backlog:view', 'backlog:edit',
    'board:view', 'board:edit', 'board:manage',
    'checklist:view',
    'file:view',
    'comment:view', 'comment:create',
    'time_entry:view'
  ],

  team_lead: [
    'project:view',
    'epic:view',
    'story:view', 'story:create', 'story:edit', 'story:assign', 'story:estimate',
    'task:view', 'task:create', 'task:edit', 'task:assign', 'task:complete',
    'sprint:view',
    'backlog:view',
    'board:view', 'board:edit',
    'checklist:view', 'checklist:edit', 'checklist:complete',
    'file:view', 'file:create', 'file:attach',
    'comment:view', 'comment:create', 'comment:edit',
    'time_entry:view', 'time_entry:create', 'time_entry:edit'
  ],

  developer: [
    'project:view',
    'epic:view',
    'story:view',
    'task:view', 'task:edit', 'task:complete', 'task:comment',
    'sprint:view',
    'backlog:view',
    'board:view',
    'checklist:view', 'checklist:complete',
    'file:view', 'file:create', 'file:attach',
    'comment:view', 'comment:create', 'comment:edit',
    'time_entry:view', 'time_entry:create', 'time_entry:edit'
  ],

  designer: [
    'project:view',
    'epic:view',
    'story:view',
    'task:view', 'task:edit', 'task:complete',
    'sprint:view',
    'backlog:view',
    'board:view',
    'checklist:view', 'checklist:complete',
    'file:view', 'file:create', 'file:edit', 'file:attach',
    'comment:view', 'comment:create', 'comment:edit',
    'time_entry:view', 'time_entry:create', 'time_entry:edit'
  ],

  qa_engineer: [
    'project:view',
    'epic:view',
    'story:view',
    'task:view', 'task:create', 'task:edit', 'task:complete', 'task:reopen',
    'sprint:view',
    'backlog:view',
    'board:view',
    'checklist:view', 'checklist:complete',
    'file:view', 'file:attach',
    'comment:view', 'comment:create',
    'time_entry:view', 'time_entry:create', 'time_entry:edit'
  ],

  stakeholder: [
    'project:view',
    'epic:view',
    'story:view',
    'task:view',
    'sprint:view',
    'backlog:view',
    'board:view',
    'file:view',
    'comment:view', 'comment:create'
  ],

  viewer: [
    'project:view',
    'epic:view',
    'story:view',
    'task:view',
    'sprint:view',
    'backlog:view',
    'board:view',
    'file:view',
    'comment:view'
  ]
}

// ============================================================================
// USER PERMISSIONS
// ============================================================================

export interface UserPermissions {
  userId: string
  projectId: string
  role: RoleName
  customPermissions?: Permission[] // Override/additional permissions
  restrictions?: Permission[] // Explicitly denied permissions
}

// ============================================================================
// PERMISSION CONTEXT
// ============================================================================

export interface PermissionContext {
  userId: string
  projectId: string
  role: RoleName
  isOwner: boolean // Is project owner
  isAssignee: boolean // Is assigned to the work item
  isCreator: boolean // Created the work item
}

// ============================================================================
// PERMISSION RULES
// ============================================================================

export interface PermissionRule {
  resource: Resource
  action: Action
  condition?: (context: PermissionContext) => boolean
}

// ============================================================================
// PERMISSION HELPERS
// ============================================================================

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: UserPermissions,
  permission: Permission
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userPermissions.role] || []

  // Check if explicitly restricted
  if (userPermissions.restrictions?.includes(permission)) {
    return false
  }

  // Check role permissions
  const hasRolePermission = rolePermissions.includes(permission)

  // Check custom permissions
  const hasCustomPermission = userPermissions.customPermissions?.includes(permission)

  return hasRolePermission || Boolean(hasCustomPermission)
}

/**
 * Check multiple permissions (OR logic - user needs at least one)
 */
export function hasAnyPermission(
  userPermissions: UserPermissions,
  permissions: Permission[]
): boolean {
  return permissions.some(permission => hasPermission(userPermissions, permission))
}

/**
 * Check multiple permissions (AND logic - user needs all)
 */
export function hasAllPermissions(
  userPermissions: UserPermissions,
  permissions: Permission[]
): boolean {
  return permissions.every(permission => hasPermission(userPermissions, permission))
}

/**
 * Get all permissions for a user
 */
export function getAllPermissions(userPermissions: UserPermissions): Permission[] {
  const rolePermissions = ROLE_PERMISSIONS[userPermissions.role] || []
  const customPermissions = userPermissions.customPermissions || []
  const restrictions = userPermissions.restrictions || []

  const allPermissions = [...new Set([...rolePermissions, ...customPermissions])]

  return allPermissions.filter(permission => !restrictions.includes(permission))
}

/**
 * Check if user can perform action on resource with context
 */
export function canPerformAction(
  userPermissions: UserPermissions,
  resource: Resource,
  action: Action,
  context?: Partial<PermissionContext>
): boolean {
  const permission: Permission = `${resource}:${action}`

  // Check basic permission
  if (!hasPermission(userPermissions, permission)) {
    return false
  }

  // Special rules for editing own items
  if (action === 'edit' && context?.isAssignee) {
    return true
  }

  // Special rules for completing assigned tasks
  if (action === 'complete' && context?.isAssignee && resource === 'task') {
    return true
  }

  return true
}

// ============================================================================
// PERMISSION ERROR
// ============================================================================

export class PermissionError extends Error {
  constructor(
    public permission: Permission,
    public userId: string,
    public resource: Resource,
    public action: Action
  ) {
    super(`User ${userId} does not have permission to ${action} ${resource}`)
    this.name = 'PermissionError'
  }
}
