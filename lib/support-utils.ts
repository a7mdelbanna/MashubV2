/**
 * MasHub V2 - Support Utility Functions
 *
 * Core utility functions for ticket management, SLA tracking,
 * knowledge base, and support analytics
 */

import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketType,
  SLAStatus,
  SLA,
  KnowledgeBaseArticle,
  ArticleStatus,
  SupportAnalytics
} from '@/types/support'

// ==================== STATUS & PRIORITY FORMATTING ====================

/**
 * Get status badge color class for tickets
 */
export function getTicketStatusColor(status: TicketStatus): string {
  const colors: Record<TicketStatus, string> = {
    new: 'bg-blue-100 text-blue-700',
    open: 'bg-indigo-100 text-indigo-700',
    pending: 'bg-yellow-100 text-yellow-700',
    on_hold: 'bg-orange-100 text-orange-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-400 text-white',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get priority badge color class
 */
export function getTicketPriorityColor(priority: TicketPriority): string {
  const colors: Record<TicketPriority, string> = {
    low: 'bg-gray-100 text-gray-600',
    normal: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
    critical: 'bg-red-500 text-white'
  }
  return colors[priority]
}

/**
 * Get SLA status badge color
 */
export function getSLAStatusColor(status: SLAStatus): string {
  const colors: Record<SLAStatus, string> = {
    met: 'bg-green-100 text-green-700',
    at_risk: 'bg-yellow-100 text-yellow-700',
    breached: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get article status badge color
 */
export function getArticleStatusColor(status: ArticleStatus): string {
  const colors: Record<ArticleStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-gray-400 text-white'
  }
  return colors[status]
}

/**
 * Format ticket status display text
 */
export function formatTicketStatus(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    new: 'New',
    open: 'Open',
    pending: 'Pending',
    on_hold: 'On Hold',
    resolved: 'Resolved',
    closed: 'Closed',
    cancelled: 'Cancelled'
  }
  return labels[status]
}

/**
 * Format ticket type display text
 */
export function formatTicketType(type: TicketType): string {
  const labels: Record<TicketType, string> = {
    question: 'Question',
    issue: 'Issue',
    bug: 'Bug',
    feature_request: 'Feature Request',
    task: 'Task',
    incident: 'Incident'
  }
  return labels[type]
}

// ==================== SLA MANAGEMENT ====================

/**
 * Calculate SLA status based on deadlines
 */
export function calculateSLAStatus(
  deadline?: string,
  breached?: boolean
): SLAStatus {
  if (!deadline) return 'met'
  if (breached) return 'breached'

  const now = new Date()
  const deadlineDate = new Date(deadline)
  const timeLeft = deadlineDate.getTime() - now.getTime()
  const hoursLeft = timeLeft / (1000 * 60 * 60)

  // At risk if less than 2 hours remaining (20% buffer)
  if (hoursLeft <= 2 && hoursLeft > 0) {
    return 'at_risk'
  }

  return hoursLeft > 0 ? 'met' : 'breached'
}

/**
 * Calculate time until deadline (in minutes)
 */
export function getTimeUntilDeadline(deadline: string): number {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diff = deadlineDate.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60))
}

/**
 * Check if SLA is breached
 */
export function isSLABreached(deadline?: string): boolean {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

/**
 * Calculate SLA breach time (in minutes)
 */
export function calculateSLABreachTime(deadline: string): number {
  if (!isSLABreached(deadline)) return 0

  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diff = now.getTime() - deadlineDate.getTime()
  return Math.ceil(diff / (1000 * 60))
}

/**
 * Format SLA time remaining
 */
export function formatSLATimeRemaining(minutes: number): string {
  if (minutes <= 0) return 'Breached'

  if (minutes < 60) {
    return `${minutes}m`
  } else if (minutes < 60 * 24) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  } else {
    const days = Math.floor(minutes / (60 * 24))
    const hours = Math.floor((minutes % (60 * 24)) / 60)
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  }
}

/**
 * Calculate response time from creation to first response
 */
export function calculateResponseTime(createdAt: string, firstResponseAt?: string): number {
  if (!firstResponseAt) return 0

  const created = new Date(createdAt)
  const response = new Date(firstResponseAt)
  const diff = response.getTime() - created.getTime()
  return Math.ceil(diff / (1000 * 60))
}

/**
 * Calculate resolution time from creation to resolution
 */
export function calculateResolutionTime(createdAt: string, resolvedAt?: string): number {
  if (!resolvedAt) return 0

  const created = new Date(createdAt)
  const resolved = new Date(resolvedAt)
  const diff = resolved.getTime() - created.getTime()
  return Math.ceil(diff / (1000 * 60))
}

// ==================== TICKET LIFECYCLE ====================

/**
 * Check if ticket is open (active)
 */
export function isTicketOpen(ticket: Ticket): boolean {
  return ['new', 'open', 'pending', 'on_hold'].includes(ticket.status)
}

/**
 * Check if ticket is closed
 */
export function isTicketClosed(ticket: Ticket): boolean {
  return ['resolved', 'closed', 'cancelled'].includes(ticket.status)
}

/**
 * Check if ticket is escalated
 */
export function isTicketEscalated(ticket: Ticket): boolean {
  return ticket.isEscalated
}

/**
 * Check if ticket requires follow-up
 */
export function requiresFollowUp(ticket: Ticket): boolean {
  if (!ticket.requiresFollowUp) return false
  if (!ticket.followUpDate) return true

  const followUpDate = new Date(ticket.followUpDate)
  return followUpDate <= new Date()
}

/**
 * Check if ticket has been reopened
 */
export function hasBeenReopened(ticket: Ticket): boolean {
  return ticket.reopenCount > 0
}

/**
 * Get ticket age in days
 */
export function getTicketAge(createdAt: string): number {
  const created = new Date(createdAt)
  const now = new Date()
  const diff = now.getTime() - created.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if ticket is stale (open for more than 30 days)
 */
export function isTicketStale(ticket: Ticket): boolean {
  if (isTicketClosed(ticket)) return false
  return getTicketAge(ticket.createdAt) > 30
}

// ==================== ASSIGNMENT & WORKLOAD ====================

/**
 * Check if ticket is assigned
 */
export function isTicketAssigned(ticket: Ticket): boolean {
  return !!ticket.assignedToUserId || !!ticket.assignedToTeamId
}

/**
 * Get agent workload (number of open tickets)
 */
export function getAgentWorkload(tickets: Ticket[], agentId: string): number {
  return tickets.filter(t =>
    t.assignedToUserId === agentId && isTicketOpen(t)
  ).length
}

/**
 * Get team workload (number of open tickets)
 */
export function getTeamWorkload(tickets: Ticket[], teamId: string): number {
  return tickets.filter(t =>
    t.assignedToTeamId === teamId && isTicketOpen(t)
  ).length
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter tickets by status
 */
export function filterTicketsByStatus(tickets: Ticket[], statuses: TicketStatus[]): Ticket[] {
  return tickets.filter(t => statuses.includes(t.status))
}

/**
 * Get open tickets
 */
export function getOpenTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(t => isTicketOpen(t))
}

/**
 * Get tickets by priority
 */
export function filterTicketsByPriority(tickets: Ticket[], priorities: TicketPriority[]): Ticket[] {
  return tickets.filter(t => priorities.includes(t.priority))
}

/**
 * Get SLA breached tickets
 */
export function getSLABreachedTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(t => t.slaBreached)
}

/**
 * Get unassigned tickets
 */
export function getUnassignedTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(t => !isTicketAssigned(t))
}

/**
 * Sort tickets by priority (critical first)
 */
export function sortTicketsByPriority(tickets: Ticket[]): Ticket[] {
  const priorityOrder: Record<TicketPriority, number> = {
    critical: 0,
    urgent: 1,
    high: 2,
    normal: 3,
    low: 4
  }

  return [...tickets].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Sort tickets by creation date (newest first)
 */
export function sortTicketsByDate(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * Sort tickets by SLA deadline (most urgent first)
 */
export function sortTicketsBySLA(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    if (!a.responseDeadline) return 1
    if (!b.responseDeadline) return -1
    return new Date(a.responseDeadline).getTime() - new Date(b.responseDeadline).getTime()
  })
}

// ==================== SEARCH ====================

/**
 * Search tickets by number, subject, or customer
 */
export function searchTickets(tickets: Ticket[], query: string): Ticket[] {
  const lowercaseQuery = query.toLowerCase()

  return tickets.filter(ticket =>
    ticket.ticketNumber.toLowerCase().includes(lowercaseQuery) ||
    ticket.subject.toLowerCase().includes(lowercaseQuery) ||
    ticket.description.toLowerCase().includes(lowercaseQuery) ||
    ticket.customerName?.toLowerCase().includes(lowercaseQuery) ||
    ticket.customerEmail.toLowerCase().includes(lowercaseQuery)
  )
}

// ==================== KNOWLEDGE BASE ====================

/**
 * Calculate article helpfulness ratio
 */
export function calculateHelpfulnessRatio(helpful: number, notHelpful: number): number {
  const total = helpful + notHelpful
  if (total === 0) return 0
  return Math.round((helpful / total) * 100)
}

/**
 * Check if article is helpful (>70% ratio)
 */
export function isArticleHelpful(article: KnowledgeBaseArticle): boolean {
  return article.helpfulnessRatio >= 70
}

/**
 * Check if article needs review
 */
export function articleNeedsReview(article: KnowledgeBaseArticle): boolean {
  if (!article.nextReviewDate) return false
  return new Date(article.nextReviewDate) <= new Date()
}

/**
 * Sort articles by popularity (views)
 */
export function sortArticlesByPopularity(articles: KnowledgeBaseArticle[]): KnowledgeBaseArticle[] {
  return [...articles].sort((a, b) => b.viewsCount - a.viewsCount)
}

/**
 * Sort articles by helpfulness
 */
export function sortArticlesByHelpfulness(articles: KnowledgeBaseArticle[]): KnowledgeBaseArticle[] {
  return [...articles].sort((a, b) => b.helpfulnessRatio - a.helpfulnessRatio)
}

/**
 * Get featured articles
 */
export function getFeaturedArticles(articles: KnowledgeBaseArticle[]): KnowledgeBaseArticle[] {
  return articles
    .filter(a => a.isFeatured && a.status === 'published')
    .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))
}

/**
 * Search articles
 */
export function searchArticles(articles: KnowledgeBaseArticle[], query: string): KnowledgeBaseArticle[] {
  const lowercaseQuery = query.toLowerCase()

  return articles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.excerpt?.toLowerCase().includes(lowercaseQuery) ||
    article.keywords.some(k => k.toLowerCase().includes(lowercaseQuery)) ||
    article.tags.some(t => t.toLowerCase().includes(lowercaseQuery))
  )
}

// ==================== SATISFACTION & RATINGS ====================

/**
 * Calculate CSAT score (1-5 average)
 */
export function calculateCSATScore(tickets: Ticket[]): number {
  const rated = tickets.filter(t => t.satisfactionRating)
  if (rated.length === 0) return 0

  const total = rated.reduce((sum, t) => sum + (t.satisfactionRating || 0), 0)
  return Math.round((total / rated.length) * 10) / 10 // Round to 1 decimal
}

/**
 * Calculate CSAT response rate
 */
export function calculateCSATResponseRate(tickets: Ticket[]): number {
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')
  if (resolved.length === 0) return 0

  const rated = resolved.filter(t => t.satisfactionRating).length
  return Math.round((rated / resolved.length) * 100)
}

/**
 * Get satisfaction rating emoji
 */
export function getSatisfactionEmoji(rating: number): string {
  if (rating >= 4.5) return '😍'
  if (rating >= 4.0) return '😊'
  if (rating >= 3.0) return '😐'
  if (rating >= 2.0) return '😕'
  return '😞'
}

// ==================== TIME TRACKING ====================

/**
 * Format time spent (minutes) to readable format
 */
export function formatTimeSpent(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  } else if (minutes < 60 * 8) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  } else {
    const days = Math.floor(minutes / (60 * 8))
    const hours = Math.floor((minutes % (60 * 8)) / 60)
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  }
}

/**
 * Calculate average time spent per ticket
 */
export function calculateAvgTimeSpent(tickets: Ticket[]): number {
  if (tickets.length === 0) return 0
  const total = tickets.reduce((sum, t) => sum + t.timeSpent, 0)
  return Math.round(total / tickets.length)
}

// ==================== ANALYTICS ====================

/**
 * Calculate first contact resolution rate
 */
export function calculateFCR(tickets: Ticket[]): number {
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')
  if (resolved.length === 0) return 0

  const firstContact = resolved.filter(t => t.commentsCount <= 1).length
  return Math.round((firstContact / resolved.length) * 100)
}

/**
 * Calculate reopen rate
 */
export function calculateReopenRate(tickets: Ticket[]): number {
  const closed = tickets.filter(t => t.status === 'closed')
  if (closed.length === 0) return 0

  const reopened = closed.filter(t => t.reopenCount > 0).length
  return Math.round((reopened / closed.length) * 100)
}

/**
 * Calculate resolution rate
 */
export function calculateResolutionRate(tickets: Ticket[]): number {
  if (tickets.length === 0) return 0
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  return Math.round((resolved / tickets.length) * 100)
}

/**
 * Calculate SLA compliance rate
 */
export function calculateSLAComplianceRate(tickets: Ticket[]): number {
  const withSLA = tickets.filter(t => t.slaId)
  if (withSLA.length === 0) return 100

  const compliant = withSLA.filter(t => !t.slaBreached).length
  return Math.round((compliant / withSLA.length) * 100)
}

/**
 * Calculate average first response time
 */
export function calculateAvgFirstResponseTime(tickets: Ticket[]): number {
  const withResponse = tickets.filter(t => t.firstResponseAt)
  if (withResponse.length === 0) return 0

  const totalMinutes = withResponse.reduce((sum, t) => {
    return sum + calculateResponseTime(t.createdAt, t.firstResponseAt)
  }, 0)

  return Math.round(totalMinutes / withResponse.length)
}

/**
 * Calculate average resolution time
 */
export function calculateAvgResolutionTime(tickets: Ticket[]): number {
  const resolved = tickets.filter(t => t.resolvedAt)
  if (resolved.length === 0) return 0

  const totalMinutes = resolved.reduce((sum, t) => {
    return sum + calculateResolutionTime(t.createdAt, t.resolvedAt)
  }, 0)

  return Math.round(totalMinutes / resolved.length)
}

/**
 * Generate support analytics summary
 */
export function generateSupportAnalytics(tickets: Ticket[]): SupportAnalytics {
  const openTickets = getOpenTickets(tickets)
  const resolvedTickets = tickets.filter(t => t.status === 'resolved')
  const closedTickets = tickets.filter(t => t.status === 'closed')

  const currentMonth = tickets.filter(t => {
    const created = new Date(t.createdAt)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  })

  return {
    totalTickets: tickets.length,
    newTickets: currentMonth.length,
    openTickets: openTickets.length,
    resolvedTickets: resolvedTickets.length,
    closedTickets: closedTickets.length,
    avgFirstResponseTime: calculateAvgFirstResponseTime(tickets),
    avgResolutionTime: calculateAvgResolutionTime(tickets),
    firstContactResolutionRate: calculateFCR(tickets),
    slaComplianceRate: calculateSLAComplianceRate(tickets),
    breachedTickets: getSLABreachedTickets(tickets).length,
    avgCSAT: calculateCSATScore(tickets),
    csatResponseRate: calculateCSATResponseRate(tickets),
    ticketsPerAgent: 0, // Would need agent data
    resolutionRate: calculateResolutionRate(tickets),
    reopenRate: calculateReopenRate(tickets),
    backlogSize: openTickets.length,
    backlogGrowth: 0, // Would need historical data
    ticketsBySource: [],
    ticketsByMonth: [],
    resolutionTimeByMonth: [],
    csatByMonth: [],
    ticketsByCategory: [],
    agentPerformance: []
  }
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
 * Validate ticket number format
 */
export function isValidTicketNumber(number: string): boolean {
  const ticketRegex = /^[A-Z]+-[0-9]+$/
  return ticketRegex.test(number)
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate ticket number
 */
export function generateTicketNumber(id: number, prefix: string = 'TKT'): string {
  return `${prefix}-${id.toString().padStart(6, '0')}`
}

/**
 * Get ticket urgency score (for prioritization)
 */
export function getTicketUrgencyScore(ticket: Ticket): number {
  let score = 0

  // Priority score
  const priorityScores: Record<TicketPriority, number> = {
    critical: 100,
    urgent: 80,
    high: 60,
    normal: 40,
    low: 20
  }
  score += priorityScores[ticket.priority]

  // SLA status score
  if (ticket.slaBreached) score += 50
  else if (ticket.slaStatus === 'at_risk') score += 25

  // Age score (older tickets get higher score)
  const age = getTicketAge(ticket.createdAt)
  score += Math.min(age * 2, 30)

  // Escalation score
  if (ticket.isEscalated) score += 40

  return score
}

/**
 * Format ticket age
 */
export function formatTicketAge(createdAt: string): string {
  const age = getTicketAge(createdAt)

  if (age === 0) return 'Today'
  if (age === 1) return 'Yesterday'
  if (age < 7) return `${age} days ago`
  if (age < 30) return `${Math.floor(age / 7)} weeks ago`
  return `${Math.floor(age / 30)} months ago`
}
