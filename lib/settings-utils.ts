/**
 * MasHub V2 - Settings Utility Functions
 *
 * Core utility functions for user management, permissions, roles,
 * notifications, and system settings
 */

import {
  User,
  UserRole,
  UserStatus,
  Permission,
  PermissionScope,
  Role,
  NotificationSettings,
  TenantSettings,
  SecuritySettings,
  MFAMethod
} from '@/types/settings'

// ==================== USER & ROLE FORMATTING ====================

/**
 * Get status badge color class for users
 */
export function getUserStatusColor(status: UserStatus): string {
  const colors: Record<UserStatus, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-600',
    suspended: 'bg-red-100 text-red-700',
    pending_verification: 'bg-yellow-100 text-yellow-700'
  }
  return colors[status]
}

/**
 * Get role badge color
 */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-purple-500 text-white',
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-blue-100 text-blue-700',
    employee: 'bg-green-100 text-green-700',
    client: 'bg-indigo-100 text-indigo-700',
    vendor: 'bg-orange-100 text-orange-700',
    guest: 'bg-gray-100 text-gray-600'
  }
  return colors[role]
}

/**
 * Format user role display text
 */
export function formatUserRole(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    employee: 'Employee',
    client: 'Client',
    vendor: 'Vendor',
    guest: 'Guest'
  }
  return labels[role]
}

/**
 * Format user status display text
 */
export function formatUserStatus(status: UserStatus): string {
  const labels: Record<UserStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    pending_verification: 'Pending Verification'
  }
  return labels[status]
}

// ==================== PERMISSIONS & AUTHORIZATION ====================

/**
 * Check if user has permission
 */
export function hasPermission(
  user: User,
  resource: string,
  action: Permission['actions'][0]['action']
): boolean {
  const permission = user.permissions.find(p => p.resource === resource)
  if (!permission) return false

  const actionPermission = permission.actions.find(a => a.action === action)
  return actionPermission?.allowed || false
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.role)
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User): boolean {
  return user.role === 'super_admin' || user.role === 'admin'
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User): boolean {
  return user.role === 'super_admin'
}

/**
 * Get permission scope display text
 */
export function formatPermissionScope(scope: PermissionScope): string {
  const labels: Record<PermissionScope, string> = {
    global: 'Global',
    tenant: 'Tenant',
    team: 'Team',
    personal: 'Personal'
  }
  return labels[scope]
}

/**
 * Calculate permission level score (for comparison)
 */
export function getPermissionLevel(role: UserRole): number {
  const levels: Record<UserRole, number> = {
    super_admin: 100,
    admin: 80,
    manager: 60,
    employee: 40,
    client: 30,
    vendor: 20,
    guest: 10
  }
  return levels[role]
}

/**
 * Compare user roles (returns true if first role >= second role)
 */
export function hasHigherOrEqualRole(role1: UserRole, role2: UserRole): boolean {
  return getPermissionLevel(role1) >= getPermissionLevel(role2)
}

// ==================== USER MANAGEMENT ====================

/**
 * Format user full name
 */
export function formatUserFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(firstName: string, lastName: string): string {
  const first = firstName.charAt(0).toUpperCase()
  const last = lastName.charAt(0).toUpperCase()
  return `${first}${last}`
}

/**
 * Get user display name (with role)
 */
export function getUserDisplayName(user: User, includeRole: boolean = false): string {
  if (includeRole) {
    return `${user.fullName} (${formatUserRole(user.role)})`
  }
  return user.fullName
}

/**
 * Check if user is active
 */
export function isUserActive(user: User): boolean {
  return user.status === 'active'
}

/**
 * Check if user is suspended
 */
export function isUserSuspended(user: User): boolean {
  return user.status === 'suspended'
}

/**
 * Check if user account is verified
 */
export function isUserVerified(user: User): boolean {
  return user.isEmailVerified
}

/**
 * Calculate days since last login
 */
export function getDaysSinceLastLogin(lastLoginAt?: string): number {
  if (!lastLoginAt) return 999

  const now = new Date()
  const lastLogin = new Date(lastLoginAt)
  const diff = now.getTime() - lastLogin.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if user is inactive (no login in 30 days)
 */
export function isUserInactive(user: User): boolean {
  return getDaysSinceLastLogin(user.lastLoginAt) > 30
}

/**
 * Check if password needs change (older than 90 days)
 */
export function needsPasswordChange(user: User): boolean {
  if (!user.passwordLastChangedAt) return true

  const now = new Date()
  const lastChanged = new Date(user.passwordLastChangedAt)
  const daysSince = Math.floor((now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24))

  return daysSince > 90
}

/**
 * Check if account is locked (too many failed login attempts)
 */
export function isAccountLocked(user: User, maxAttempts: number = 5): boolean {
  return user.failedLoginAttempts >= maxAttempts
}

// ==================== SECURITY ====================

/**
 * Validate password strength
 */
export function validatePasswordStrength(
  password: string,
  settings: SecuritySettings
): { valid: boolean, errors: string[] } {
  const errors: string[] = []

  if (password.length < settings.passwordMinLength) {
    errors.push(`Password must be at least ${settings.passwordMinLength} characters`)
  }

  if (settings.passwordRequireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (settings.passwordRequireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (settings.passwordRequireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (settings.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Calculate password strength score (0-100)
 */
export function calculatePasswordStrength(password: string): number {
  let score = 0

  // Length
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10

  // Character variety
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15

  return Math.min(score, 100)
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): 'weak' | 'fair' | 'good' | 'strong' {
  if (score >= 80) return 'strong'
  if (score >= 60) return 'good'
  if (score >= 40) return 'fair'
  return 'weak'
}

/**
 * Format MFA method display text
 */
export function formatMFAMethod(method: MFAMethod): string {
  const labels: Record<MFAMethod, string> = {
    none: 'None',
    sms: 'SMS',
    email: 'Email',
    authenticator: 'Authenticator App',
    biometric: 'Biometric'
  }
  return labels[method]
}

/**
 * Check if MFA is enabled for user
 */
export function isMFAEnabled(user: User): boolean {
  return user.mfaEnabled && user.mfaMethod !== 'none'
}

// ==================== NOTIFICATIONS ====================

/**
 * Check if notifications are enabled for user
 */
export function areNotificationsEnabled(settings: NotificationSettings): boolean {
  return settings.enabled
}

/**
 * Check if notification channel is enabled
 */
export function isChannelEnabled(
  settings: NotificationSettings,
  channel: NotificationSettings['channels'][0]
): boolean {
  return settings.channels.includes(channel)
}

/**
 * Check if in quiet hours
 */
export function isInQuietHours(settings: NotificationSettings): boolean {
  if (!settings.quietHours?.enabled) return false

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute

  const [startHour, startMin] = settings.quietHours.start.split(':').map(Number)
  const [endHour, endMin] = settings.quietHours.end.split(':').map(Number)

  const startTime = startHour * 60 + startMin
  const endTime = endHour * 60 + endMin

  if (startTime < endTime) {
    return currentTime >= startTime && currentTime <= endTime
  } else {
    // Quiet hours span midnight
    return currentTime >= startTime || currentTime <= endTime
  }
}

/**
 * Check if notification category is enabled
 */
export function isCategoryEnabled(
  settings: NotificationSettings,
  category: string
): boolean {
  const cat = settings.categories.find(c => c.category === category)
  return cat?.enabled || false
}

// ==================== TENANT SETTINGS ====================

/**
 * Format currency amount with tenant currency
 */
export function formatTenantCurrency(amount: number, settings: TenantSettings): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: settings.currency
  }).format(amount)
}

/**
 * Format date with tenant format
 */
export function formatTenantDate(date: Date, settings: TenantSettings): string {
  // Common date formats
  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    'MM/DD/YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
    'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' }
  }

  const options = formats[settings.dateFormat] || formats['MM/DD/YYYY']
  return new Intl.DateTimeFormat(settings.locale, options).format(date)
}

/**
 * Format time with tenant format
 */
export function formatTenantTime(date: Date, settings: TenantSettings): string {
  const hour12 = settings.timeFormat === '12h'
  return new Intl.DateTimeFormat(settings.locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: hour12
  }).format(date)
}

/**
 * Check if module is enabled for tenant
 */
export function isModuleEnabled(settings: TenantSettings, module: string): boolean {
  return settings.enabledModules.includes(module)
}

/**
 * Check if tenant is on trial
 */
export function isTenantOnTrial(settings: TenantSettings): boolean {
  return settings.isTrialActive && !!settings.trialEndsAt
}

/**
 * Get trial days remaining
 */
export function getTrialDaysRemaining(settings: TenantSettings): number {
  if (!settings.trialEndsAt) return 0

  const now = new Date()
  const trialEnd = new Date(settings.trialEndsAt)
  const diff = trialEnd.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Check if tenant plan is active
 */
export function isTenantPlanActive(settings: TenantSettings): boolean {
  if (!settings.planEndDate) return true
  return new Date(settings.planEndDate) > new Date()
}

/**
 * Calculate tenant usage percentage
 */
export function calculateUsagePercentage(used: number, limit: number): number {
  if (limit === 0) return 0
  return Math.round((used / limit) * 100)
}

/**
 * Check if approaching limit (within 10%)
 */
export function isApproachingLimit(used: number, limit: number): boolean {
  const percentage = calculateUsagePercentage(used, limit)
  return percentage >= 90
}

// ==================== VALIDATION ====================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone format (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

/**
 * Validate timezone
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

/**
 * Validate currency code
 */
export function isValidCurrency(currency: string): boolean {
  try {
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    return true
  } catch {
    return false
  }
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter users by role
 */
export function filterUsersByRole(users: User[], roles: UserRole[]): User[] {
  return users.filter(u => roles.includes(u.role))
}

/**
 * Filter users by status
 */
export function filterUsersByStatus(users: User[], statuses: UserStatus[]): User[] {
  return users.filter(u => statuses.includes(u.status))
}

/**
 * Get active users
 */
export function getActiveUsers(users: User[]): User[] {
  return filterUsersByStatus(users, ['active'])
}

/**
 * Get admin users
 */
export function getAdminUsers(users: User[]): User[] {
  return filterUsersByRole(users, ['super_admin', 'admin'])
}

/**
 * Sort users by name (A-Z)
 */
export function sortUsersByName(users: User[]): User[] {
  return [...users].sort((a, b) => a.fullName.localeCompare(b.fullName))
}

/**
 * Sort users by role level (highest first)
 */
export function sortUsersByRole(users: User[]): User[] {
  return [...users].sort((a, b) => {
    return getPermissionLevel(b.role) - getPermissionLevel(a.role)
  })
}

/**
 * Sort users by last login (most recent first)
 */
export function sortUsersByLastLogin(users: User[]): User[] {
  return [...users].sort((a, b) => {
    if (!a.lastLoginAt) return 1
    if (!b.lastLoginAt) return -1
    return new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime()
  })
}

// ==================== SEARCH ====================

/**
 * Search users by name or email
 */
export function searchUsers(users: User[], query: string): User[] {
  const lowercaseQuery = query.toLowerCase()

  return users.filter(user =>
    user.fullName.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery) ||
    user.firstName.toLowerCase().includes(lowercaseQuery) ||
    user.lastName.toLowerCase().includes(lowercaseQuery)
  )
}

// ==================== TEAM MANAGEMENT ====================

/**
 * Check if user is in team
 */
export function isUserInTeam(user: User, teamId: string): boolean {
  return user.teams.includes(teamId)
}

/**
 * Get users by team
 */
export function getUsersByTeam(users: User[], teamId: string): User[] {
  return users.filter(u => isUserInTeam(u, teamId))
}

/**
 * Get users by department
 */
export function getUsersByDepartment(users: User[], department: string): User[] {
  return users.filter(u => u.departments.includes(department))
}

// ==================== ANALYTICS ====================

/**
 * Calculate user growth rate
 */
export function calculateUserGrowth(currentUsers: number, previousUsers: number): number {
  if (previousUsers === 0) return 100
  return Math.round(((currentUsers - previousUsers) / previousUsers) * 100)
}

/**
 * Calculate active user percentage
 */
export function calculateActiveUserPercentage(users: User[]): number {
  if (users.length === 0) return 0
  const active = getActiveUsers(users).length
  return Math.round((active / users.length) * 100)
}

/**
 * Get user distribution by role
 */
export function getUserDistributionByRole(users: User[]): Record<UserRole, number> {
  const distribution: Record<string, number> = {}

  users.forEach(user => {
    distribution[user.role] = (distribution[user.role] || 0) + 1
  })

  return distribution as Record<UserRole, number>
}

// ==================== API KEY MANAGEMENT ====================

/**
 * Generate API key prefix (first 8 characters)
 */
export function generateAPIKeyPrefix(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let prefix = ''
  for (let i = 0; i < 8; i++) {
    prefix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return prefix
}

/**
 * Mask API key (show only prefix)
 */
export function maskAPIKey(key: string, prefix: string): string {
  return `${prefix}${'*'.repeat(32)}`
}

/**
 * Check if API key is expired
 */
export function isAPIKeyExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

// ==================== AUDIT LOG ====================

/**
 * Format audit action display text
 */
export function formatAuditAction(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get audit action icon
 */
export function getAuditActionIcon(action: string): string {
  if (action.includes('create')) return '➕'
  if (action.includes('update') || action.includes('edit')) return '✏️'
  if (action.includes('delete')) return '🗑️'
  if (action.includes('login')) return '🔐'
  if (action.includes('logout')) return '🚪'
  return '📝'
}

/**
 * Format time ago
 */
export function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 4) return `${diffWeeks}w ago`

  const diffMonths = Math.floor(diffDays / 30)
  return `${diffMonths}mo ago`
}

// ==================== BILLING ====================

/**
 * Format plan name
 */
export function formatPlanName(plan: string): string {
  return plan
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get plan color
 */
export function getPlanColor(plan: string): string {
  const colors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    starter: 'bg-blue-100 text-blue-700',
    professional: 'bg-purple-100 text-purple-700',
    enterprise: 'bg-indigo-500 text-white',
    custom: 'bg-orange-100 text-orange-700'
  }
  return colors[plan] || 'bg-gray-100 text-gray-700'
}
