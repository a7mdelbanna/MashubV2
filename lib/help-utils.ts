// Help & Support Utility Functions
// Helper functions for knowledge base and support ticket workflows

import {
  Article,
  ArticleCategory,
  ArticleStatus,
  FAQ,
  SupportTicket,
  TicketStatus,
  TicketPriority,
  TicketType,
  DifficultyLevel,
  ContentType,
  SearchResult,
  ServiceStatus,
  Incident
} from '@/types/help'

// ============================================================================
// STATUS & CATEGORY HELPERS
// ============================================================================

export function getArticleStatusColor(status: ArticleStatus): string {
  const colors: Record<ArticleStatus, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    published: 'bg-green-500/20 text-green-400',
    archived: 'bg-yellow-500/20 text-yellow-400'
  }
  return colors[status]
}

export function getTicketStatusColor(status: TicketStatus): string {
  const colors: Record<TicketStatus, string> = {
    open: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-purple-500/20 text-purple-400',
    waiting_response: 'bg-yellow-500/20 text-yellow-400',
    resolved: 'bg-green-500/20 text-green-400',
    closed: 'bg-gray-500/20 text-gray-400'
  }
  return colors[status]
}

export function getTicketPriorityColor(priority: TicketPriority): string {
  const colors: Record<TicketPriority, string> = {
    low: 'bg-gray-500/20 text-gray-400',
    medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400'
  }
  return colors[priority]
}

export function getCategoryColor(category: ArticleCategory): string {
  const colors: Record<ArticleCategory, string> = {
    getting_started: 'bg-blue-500/20 text-blue-400',
    features: 'bg-purple-500/20 text-purple-400',
    integrations: 'bg-cyan-500/20 text-cyan-400',
    troubleshooting: 'bg-orange-500/20 text-orange-400',
    billing: 'bg-green-500/20 text-green-400',
    api: 'bg-pink-500/20 text-pink-400',
    security: 'bg-red-500/20 text-red-400',
    mobile: 'bg-indigo-500/20 text-indigo-400'
  }
  return colors[category]
}

export function getDifficultyColor(difficulty: DifficultyLevel): string {
  const colors: Record<DifficultyLevel, string> = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400'
  }
  return colors[difficulty]
}

export function getServiceStatusColor(status: ServiceStatus['status']): string {
  const colors = {
    operational: 'bg-green-500/20 text-green-400',
    degraded: 'bg-yellow-500/20 text-yellow-400',
    down: 'bg-red-500/20 text-red-400',
    maintenance: 'bg-blue-500/20 text-blue-400'
  }
  return colors[status]
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

export function formatArticleStatus(status: ArticleStatus): string {
  const labels: Record<ArticleStatus, string> = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived'
  }
  return labels[status]
}

export function formatTicketStatus(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    waiting_response: 'Waiting Response',
    resolved: 'Resolved',
    closed: 'Closed'
  }
  return labels[status]
}

export function formatTicketPriority(priority: TicketPriority): string {
  const labels: Record<TicketPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  }
  return labels[priority]
}

export function formatTicketType(type: TicketType): string {
  const labels: Record<TicketType, string> = {
    question: 'Question',
    bug: 'Bug Report',
    feature_request: 'Feature Request',
    technical_issue: 'Technical Issue',
    billing: 'Billing',
    account: 'Account',
    other: 'Other'
  }
  return labels[type]
}

export function formatCategory(category: ArticleCategory): string {
  const labels: Record<ArticleCategory, string> = {
    getting_started: 'Getting Started',
    features: 'Features',
    integrations: 'Integrations',
    troubleshooting: 'Troubleshooting',
    billing: 'Billing',
    api: 'API',
    security: 'Security',
    mobile: 'Mobile'
  }
  return labels[category]
}

export function formatDifficulty(difficulty: DifficultyLevel): string {
  const labels: Record<DifficultyLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }
  return labels[difficulty]
}

export function formatContentType(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    article: 'Article',
    video: 'Video',
    tutorial: 'Tutorial',
    guide: 'Guide',
    faq: 'FAQ'
  }
  return labels[type]
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function formatReadTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min read'
  return `${Math.round(minutes)} min read`
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

export function calculateHelpfulPercentage(helpfulCount: number, notHelpfulCount: number): number {
  const total = helpfulCount + notHelpfulCount
  if (total === 0) return 0
  return Math.round((helpfulCount / total) * 100)
}

export function calculateResponseTime(createdAt: string, firstResponseAt?: string): number | null {
  if (!firstResponseAt) return null

  const created = new Date(createdAt).getTime()
  const responded = new Date(firstResponseAt).getTime()
  const diff = responded - created

  return Math.floor(diff / (1000 * 60)) // in minutes
}

export function calculateResolutionTime(createdAt: string, resolvedAt?: string): number | null {
  if (!resolvedAt) return null

  const created = new Date(createdAt).getTime()
  const resolved = new Date(resolvedAt).getTime()
  const diff = resolved - created

  return Math.floor(diff / (1000 * 60)) // in minutes
}

export function formatResponseTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  } else {
    const days = Math.floor(minutes / 1440)
    const hours = Math.floor((minutes % 1440) / 60)
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  }
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// ============================================================================
// SEARCH & FILTERING HELPERS
// ============================================================================

export function searchArticles(articles: Article[], query: string): Article[] {
  const lowerQuery = query.toLowerCase()
  return articles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.content.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function searchFAQs(faqs: FAQ[], query: string): FAQ[] {
  const lowerQuery = query.toLowerCase()
  return faqs.filter(faq =>
    faq.question.toLowerCase().includes(lowerQuery) ||
    faq.answer.toLowerCase().includes(lowerQuery)
  )
}

export function filterArticlesByCategory(articles: Article[], category: ArticleCategory): Article[] {
  return articles.filter(article => article.category === category)
}

export function filterArticlesByDifficulty(articles: Article[], difficulty: DifficultyLevel): Article[] {
  return articles.filter(article => article.difficulty === difficulty)
}

export function filterTicketsByStatus(tickets: SupportTicket[], statuses: TicketStatus[]): SupportTicket[] {
  if (statuses.length === 0) return tickets
  return tickets.filter(ticket => statuses.includes(ticket.status))
}

export function filterTicketsByPriority(tickets: SupportTicket[], priorities: TicketPriority[]): SupportTicket[] {
  if (priorities.length === 0) return tickets
  return tickets.filter(ticket => priorities.includes(ticket.priority))
}

export function searchTickets(tickets: SupportTicket[], query: string): SupportTicket[] {
  const lowerQuery = query.toLowerCase()
  return tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(lowerQuery) ||
    ticket.description.toLowerCase().includes(lowerQuery) ||
    ticket.ticketNumber.toLowerCase().includes(lowerQuery) ||
    ticket.requesterEmail.toLowerCase().includes(lowerQuery)
  )
}

// ============================================================================
// SORTING HELPERS
// ============================================================================

export function sortArticlesByPopularity(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => b.viewCount - a.viewCount)
}

export function sortArticlesByHelpful(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const aPercentage = calculateHelpfulPercentage(a.helpfulCount, a.notHelpfulCount)
    const bPercentage = calculateHelpfulPercentage(b.helpfulCount, b.notHelpfulCount)
    return bPercentage - aPercentage
  })
}

export function sortArticlesByRecent(articles: Article[]): Article[] {
  return [...articles].sort((a, b) =>
    new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
  )
}

export function sortTicketsByPriority(tickets: SupportTicket[]): SupportTicket[] {
  const priorityOrder: Record<TicketPriority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
  }
  return [...tickets].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
}

export function sortTicketsByDate(tickets: SupportTicket[], order: 'asc' | 'desc' = 'desc'): SupportTicket[] {
  return [...tickets].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return order === 'desc' ? diff : -diff
  })
}

// ============================================================================
// TICKET HELPERS
// ============================================================================

export function getOpenTickets(tickets: SupportTicket[]): SupportTicket[] {
  return tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting_response')
}

export function getResolvedTickets(tickets: SupportTicket[]): SupportTicket[] {
  return tickets.filter(t => t.status === 'resolved' || t.status === 'closed')
}

export function getUrgentTickets(tickets: SupportTicket[]): SupportTicket[] {
  return tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed')
}

export function getUnassignedTickets(tickets: SupportTicket[]): SupportTicket[] {
  return tickets.filter(t => !t.assignedTo && t.status !== 'resolved' && t.status !== 'closed')
}

export function needsResponse(ticket: SupportTicket): boolean {
  if (!ticket.messages.length) return true

  const lastMessage = ticket.messages[ticket.messages.length - 1]
  return lastMessage.senderType === 'customer'
}

export function isOverdue(ticket: SupportTicket, slaMinutes: number = 240): boolean {
  if (ticket.status === 'resolved' || ticket.status === 'closed') return false

  const created = new Date(ticket.createdAt).getTime()
  const now = new Date().getTime()
  const elapsed = (now - created) / (1000 * 60)

  return elapsed > slaMinutes
}

// ============================================================================
// ARTICLE HELPERS
// ============================================================================

export function getPopularArticles(articles: Article[], limit: number = 10): Article[] {
  return sortArticlesByPopularity(articles).slice(0, limit)
}

export function getRecentArticles(articles: Article[], limit: number = 10): Article[] {
  return sortArticlesByRecent(articles).slice(0, limit)
}

export function getRelatedArticles(article: Article, allArticles: Article[], limit: number = 5): Article[] {
  // Filter by same category and shared tags
  return allArticles
    .filter(a => a.id !== article.id)
    .filter(a => a.status === 'published')
    .filter(a =>
      a.category === article.category ||
      a.tags.some(tag => article.tags.includes(tag))
    )
    .slice(0, limit)
}

export function getFeaturedArticles(articles: Article[]): Article[] {
  // Get published articles with high helpful ratings
  return articles
    .filter(a => a.status === 'published')
    .filter(a => {
      const helpfulPercentage = calculateHelpfulPercentage(a.helpfulCount, a.notHelpfulCount)
      return helpfulPercentage >= 80 && (a.helpfulCount + a.notHelpfulCount) >= 10
    })
    .slice(0, 6)
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

export function calculateTicketStats(tickets: SupportTicket[]) {
  const total = tickets.length
  const open = tickets.filter(t => t.status === 'open').length
  const inProgress = tickets.filter(t => t.status === 'in_progress').length
  const resolved = tickets.filter(t => t.status === 'resolved').length
  const closed = tickets.filter(t => t.status === 'closed').length

  const responseTimes = tickets
    .filter(t => t.responseTime)
    .map(t => t.responseTime!)

  const resolutionTimes = tickets
    .filter(t => t.resolutionTime)
    .map(t => t.resolutionTime!)

  const ratings = tickets
    .filter(t => t.satisfaction)
    .map(t => t.satisfaction!.rating)

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    avgResponseTime: responseTimes.length > 0
      ? Math.round(responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length)
      : 0,
    avgResolutionTime: resolutionTimes.length > 0
      ? Math.round(resolutionTimes.reduce((sum, t) => sum + t, 0) / resolutionTimes.length)
      : 0,
    satisfactionScore: ratings.length > 0
      ? calculateAverageRating(ratings)
      : 0
  }
}

export function getArticlesByCategory(articles: Article[]): Record<ArticleCategory, number> {
  const categories: Record<ArticleCategory, number> = {
    getting_started: 0,
    features: 0,
    integrations: 0,
    troubleshooting: 0,
    billing: 0,
    api: 0,
    security: 0,
    mobile: 0
  }

  articles.forEach(article => {
    if (article.status === 'published') {
      categories[article.category]++
    }
  })

  return categories
}

export function getTicketsByType(tickets: SupportTicket[]): Record<TicketType, number> {
  const types: Record<TicketType, number> = {
    question: 0,
    bug: 0,
    feature_request: 0,
    technical_issue: 0,
    billing: 0,
    account: 0,
    other: 0
  }

  tickets.forEach(ticket => {
    types[ticket.type]++
  })

  return types
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isValidTicketNumber(ticketNumber: string): boolean {
  // Format: TICK-12345
  const pattern = /^TICK-\d{5,}$/
  return pattern.test(ticketNumber)
}

export function generateTicketNumber(): string {
  const number = Math.floor(10000 + Math.random() * 90000)
  return `TICK-${number}`
}

export function canCloseTicket(ticket: SupportTicket): boolean {
  return ticket.status === 'resolved' &&
         ticket.resolution !== undefined &&
         ticket.resolvedAt !== undefined
}

export function requiresEscalation(ticket: SupportTicket): boolean {
  // Escalate if urgent and unassigned, or if open for more than 24 hours
  if (ticket.priority === 'urgent' && !ticket.assignedTo) return true

  const hoursSinceCreation = (new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
  return hoursSinceCreation > 24 && ticket.status === 'open'
}

// ============================================================================
// NOTIFICATION HELPERS
// ============================================================================

export function getTicketDueDate(ticket: SupportTicket): Date | null {
  const slaHours: Record<TicketPriority, number> = {
    urgent: 4,
    high: 24,
    medium: 48,
    low: 72
  }

  const hours = slaHours[ticket.priority]
  const dueDate = new Date(ticket.createdAt)
  dueDate.setHours(dueDate.getHours() + hours)

  return ticket.status === 'resolved' || ticket.status === 'closed' ? null : dueDate
}

export function getTimeRemaining(dueDate: Date): string {
  const now = new Date().getTime()
  const due = dueDate.getTime()
  const diff = due - now

  if (diff < 0) return 'Overdue'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d remaining`
  } else if (hours > 0) {
    return `${hours}h remaining`
  } else {
    return `${minutes}m remaining`
  }
}
