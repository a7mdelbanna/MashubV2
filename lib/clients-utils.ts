/**
 * MasHub V2 - Clients Utility Functions
 *
 * Core utility functions for client management, relationship tracking,
 * contract management, and client analytics
 */

import {
  Client,
  ClientStatus,
  ClientType,
  ClientPriority,
  Contract,
  ContractStatus,
  Communication,
  CommunicationType,
  ClientAnalytics
} from '@/types/clients'

// ==================== STATUS & TYPE FORMATTING ====================

/**
 * Get status badge color class for clients
 */
export function getClientStatusColor(status: ClientStatus): string {
  const colors: Record<ClientStatus, string> = {
    lead: 'bg-blue-100 text-blue-700',
    prospect: 'bg-purple-100 text-purple-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-600',
    churned: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get client type badge color
 */
export function getClientTypeColor(type: ClientType): string {
  const colors: Record<ClientType, string> = {
    individual: 'bg-indigo-100 text-indigo-700',
    business: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700',
    government: 'bg-teal-100 text-teal-700',
    nonprofit: 'bg-green-100 text-green-700'
  }
  return colors[type]
}

/**
 * Get priority badge color
 */
export function getClientPriorityColor(priority: ClientPriority): string {
  const colors: Record<ClientPriority, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    vip: 'bg-purple-500 text-white'
  }
  return colors[priority]
}

/**
 * Get contract status badge color
 */
export function getContractStatusColor(status: ContractStatus): string {
  const colors: Record<ContractStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    signed: 'bg-purple-100 text-purple-700',
    active: 'bg-green-100 text-green-700',
    expired: 'bg-yellow-100 text-yellow-700',
    terminated: 'bg-red-100 text-red-700',
    renewed: 'bg-indigo-100 text-indigo-700'
  }
  return colors[status]
}

/**
 * Format client status display text
 */
export function formatClientStatus(status: ClientStatus): string {
  const labels: Record<ClientStatus, string> = {
    lead: 'Lead',
    prospect: 'Prospect',
    active: 'Active',
    inactive: 'Inactive',
    churned: 'Churned'
  }
  return labels[status]
}

// ==================== FINANCIAL CALCULATIONS ====================

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Calculate client lifetime value (LTV)
 */
export function calculateLifetimeValue(client: Client): number {
  return client.lifetimeValue || client.totalRevenue
}

/**
 * Calculate average invoice value
 */
export function calculateAvgInvoiceValue(totalRevenue: number, invoiceCount: number): number {
  if (invoiceCount === 0) return 0
  return totalRevenue / invoiceCount
}

/**
 * Calculate outstanding balance percentage
 */
export function calculateOutstandingPercentage(outstanding: number, total: number): number {
  if (total === 0) return 0
  return Math.round((outstanding / total) * 100)
}

/**
 * Check if client has outstanding balance
 */
export function hasOutstandingBalance(client: Client): boolean {
  return client.outstandingBalance > 0
}

/**
 * Check if payment is overdue
 */
export function isPaymentOverdue(client: Client): boolean {
  return client.overdueAmount > 0
}

// ==================== CONTRACT MANAGEMENT ====================

/**
 * Check if contract is active
 */
export function isContractActive(contract: Contract): boolean {
  return contract.status === 'active'
}

/**
 * Check if contract is expiring soon (within 30 days)
 */
export function isContractExpiringSoon(contract: Contract): boolean {
  if (!contract.endDate) return false

  const now = new Date()
  const end = new Date(contract.endDate)
  const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return daysUntilExpiry > 0 && daysUntilExpiry <= 30
}

/**
 * Check if contract is expired
 */
export function isContractExpired(contract: Contract): boolean {
  if (!contract.endDate) return false
  return new Date(contract.endDate) < new Date()
}

/**
 * Get days until contract expiry
 */
export function getDaysUntilExpiry(endDate: string): number {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Calculate contract duration in months
 */
export function getContractDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  return months
}

/**
 * Calculate contract completion percentage
 */
export function getContractProgress(contract: Contract): number {
  if (!contract.startDate || !contract.endDate) return 0

  const now = new Date()
  const start = new Date(contract.startDate)
  const end = new Date(contract.endDate)

  if (now < start) return 0
  if (now > end) return 100

  const total = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()

  return Math.round((elapsed / total) * 100)
}

// ==================== CLIENT HEALTH & ENGAGEMENT ====================

/**
 * Calculate client health score (0-100)
 */
export function calculateClientHealth(client: Client): number {
  let score = 100

  // Deduct for overdue payments
  if (client.overdueAmount > 0) {
    const overdueRatio = client.overdueAmount / (client.totalRevenue || 1)
    score -= Math.min(40, overdueRatio * 100)
  }

  // Deduct for inactivity
  if (client.lastActivityDate) {
    const daysSinceActivity = getDaysSince(client.lastActivityDate)
    if (daysSinceActivity > 90) score -= 20
    else if (daysSinceActivity > 60) score -= 10
  }

  // Deduct for no active projects
  if (client.activeProjects === 0 && client.status === 'active') {
    score -= 15
  }

  // Bonus for multiple active projects
  if (client.activeProjects > 2) {
    score += 10
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * Get client health status
 */
export function getClientHealthStatus(health: number): 'excellent' | 'good' | 'at_risk' | 'critical' {
  if (health >= 80) return 'excellent'
  if (health >= 60) return 'good'
  if (health >= 40) return 'at_risk'
  return 'critical'
}

/**
 * Calculate days since last activity
 */
export function getDaysSince(date: string): number {
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if client needs follow-up
 */
export function needsFollowUp(client: Client): boolean {
  if (!client.lastContactDate) return true

  const daysSinceContact = getDaysSince(client.lastContactDate)
  return daysSinceContact > 30 // Follow up if no contact in 30 days
}

// ==================== COMMUNICATION TRACKING ====================

/**
 * Get communication type icon
 */
export function getCommunicationTypeIcon(type: CommunicationType): string {
  const icons: Record<CommunicationType, string> = {
    email: '📧',
    phone: '📞',
    meeting: '🤝',
    video_call: '📹',
    chat: '💬',
    note: '📝'
  }
  return icons[type]
}

/**
 * Sort communications by date (newest first)
 */
export function sortCommunicationsByDate(communications: Communication[]): Communication[] {
  return [...communications].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}

/**
 * Get communications requiring follow-up
 */
export function getFollowUpCommunications(communications: Communication[]): Communication[] {
  return communications.filter(comm =>
    comm.requiresFollowUp &&
    (!comm.followUpCompletedAt || comm.followUpDate)
  )
}

/**
 * Check if follow-up is overdue
 */
export function isFollowUpOverdue(communication: Communication): boolean {
  if (!communication.followUpDate) return false
  return new Date(communication.followUpDate) < new Date()
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter clients by status
 */
export function filterClientsByStatus(clients: Client[], statuses: ClientStatus[]): Client[] {
  return clients.filter(c => statuses.includes(c.status))
}

/**
 * Get active clients
 */
export function getActiveClients(clients: Client[]): Client[] {
  return filterClientsByStatus(clients, ['active'])
}

/**
 * Get clients with overdue payments
 */
export function getClientsWithOverduePayments(clients: Client[]): Client[] {
  return clients.filter(c => c.overdueAmount > 0)
}

/**
 * Get VIP clients
 */
export function getVIPClients(clients: Client[]): Client[] {
  return clients.filter(c => c.priority === 'vip')
}

/**
 * Sort clients by revenue (highest first)
 */
export function sortClientsByRevenue(clients: Client[]): Client[] {
  return [...clients].sort((a, b) => b.totalRevenue - a.totalRevenue)
}

/**
 * Sort clients by lifetime value (highest first)
 */
export function sortClientsByLTV(clients: Client[]): Client[] {
  return [...clients].sort((a, b) => b.lifetimeValue - a.lifetimeValue)
}

/**
 * Sort clients by name (A-Z)
 */
export function sortClientsByName(clients: Client[]): Client[] {
  return [...clients].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Sort clients by last activity (most recent first)
 */
export function sortClientsByActivity(clients: Client[]): Client[] {
  return [...clients].sort((a, b) => {
    if (!a.lastActivityDate) return 1
    if (!b.lastActivityDate) return -1
    return new Date(b.lastActivityDate).getTime() - new Date(a.lastActivityDate).getTime()
  })
}

// ==================== SEGMENTATION ====================

/**
 * Segment clients by revenue tier
 */
export function segmentClientsByRevenue(clients: Client[]): {
  high: Client[],
  medium: Client[],
  low: Client[]
} {
  const revenues = clients.map(c => c.totalRevenue).sort((a, b) => b - a)
  const top20Threshold = revenues[Math.floor(revenues.length * 0.2)] || 0
  const top50Threshold = revenues[Math.floor(revenues.length * 0.5)] || 0

  return {
    high: clients.filter(c => c.totalRevenue >= top20Threshold),
    medium: clients.filter(c => c.totalRevenue < top20Threshold && c.totalRevenue >= top50Threshold),
    low: clients.filter(c => c.totalRevenue < top50Threshold)
  }
}

/**
 * Get at-risk clients
 */
export function getAtRiskClients(clients: Client[]): Client[] {
  return clients.filter(client => {
    const health = calculateClientHealth(client)
    return health < 60
  })
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
 * Validate contract dates
 */
export function validateContractDates(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return end > start
}

// ==================== SEARCH ====================

/**
 * Search clients by name, email, or company
 */
export function searchClients(clients: Client[], query: string): Client[] {
  const lowercaseQuery = query.toLowerCase()

  return clients.filter(client =>
    client.name.toLowerCase().includes(lowercaseQuery) ||
    client.email.toLowerCase().includes(lowercaseQuery) ||
    client.companyName?.toLowerCase().includes(lowercaseQuery) ||
    client.phone?.includes(query)
  )
}

// ==================== ANALYTICS ====================

/**
 * Calculate client acquisition rate
 */
export function calculateAcquisitionRate(
  newClients: number,
  totalClients: number
): number {
  if (totalClients === 0) return 0
  return Math.round((newClients / totalClients) * 100)
}

/**
 * Calculate client retention rate
 */
export function calculateRetentionRate(
  activeClients: number,
  churnedClients: number
): number {
  const total = activeClients + churnedClients
  if (total === 0) return 0
  return Math.round((activeClients / total) * 100)
}

/**
 * Calculate churn rate
 */
export function calculateChurnRate(
  churnedClients: number,
  totalClients: number
): number {
  if (totalClients === 0) return 0
  return Math.round((churnedClients / totalClients) * 100)
}

/**
 * Calculate average client value
 */
export function calculateAvgClientValue(
  totalRevenue: number,
  clientCount: number
): number {
  if (clientCount === 0) return 0
  return totalRevenue / clientCount
}

/**
 * Generate client analytics summary
 */
export function generateClientAnalytics(clients: Client[]): ClientAnalytics {
  const activeClients = getActiveClients(clients)
  const churnedClients = filterClientsByStatus(clients, ['churned'])
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0)
  const avgRevenue = totalRevenue / clients.length

  // Group by status
  const byStatus = clients.reduce((acc, client) => {
    const existing = acc.find(s => s.status === client.status)
    if (existing) {
      existing.count++
    } else {
      acc.push({ status: client.status, count: 1 })
    }
    return acc
  }, [] as Array<{ status: ClientStatus, count: number }>)

  // Group by type
  const byType = clients.reduce((acc, client) => {
    const existing = acc.find(t => t.type === client.type)
    if (existing) {
      existing.count++
    } else {
      acc.push({ type: client.type, count: 1 })
    }
    return acc
  }, [] as Array<{ type: ClientType, count: number }>)

  return {
    totalClients: clients.length,
    activeClients: activeClients.length,
    inactiveClients: filterClientsByStatus(clients, ['inactive']).length,
    churnedClients: churnedClients.length,
    totalRevenue: totalRevenue,
    avgRevenuePerClient: avgRevenue,
    totalOutstanding: clients.reduce((sum, c) => sum + c.outstandingBalance, 0),
    retentionRate: calculateRetentionRate(activeClients.length, churnedClients.length),
    churnRate: calculateChurnRate(churnedClients.length, clients.length),
    clientsByStatus: byStatus,
    clientsByType: byType,
    topClientsByRevenue: sortClientsByRevenue(clients).slice(0, 10)
  }
}

/**
 * Format client display name
 */
export function formatClientDisplayName(client: Client): string {
  if (client.companyName) {
    return `${client.name} (${client.companyName})`
  }
  return client.name
}

/**
 * Get client initials for avatar
 */
export function getClientInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
