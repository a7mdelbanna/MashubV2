// ==========================================
// SUPPORT TYPES & INTERFACES
// ==========================================

export type TicketStatus = 'new' | 'open' | 'pending' | 'on_hold' | 'resolved' | 'closed' | 'cancelled'
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent' | 'critical'
export type TicketType = 'question' | 'issue' | 'bug' | 'feature_request' | 'task' | 'incident'
export type TicketSource = 'email' | 'web' | 'phone' | 'chat' | 'social' | 'api' | 'manual'

export type SLAStatus = 'met' | 'at_risk' | 'breached'
export type SLAPriority = TicketPriority

export type ArticleStatus = 'draft' | 'published' | 'archived'
export type ArticleCategory = 'getting_started' | 'how_to' | 'troubleshooting' | 'faq' | 'release_notes' | 'api_docs'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface Ticket {
  id: string
  tenantId: string

  // Ticket Info
  ticketNumber: string
  subject: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  source: TicketSource

  // Customer
  customerId?: string
  customerName?: string
  customerEmail: string
  customerPhone?: string

  // Assignment
  assignedToUserId?: string
  assignedToUserName?: string
  assignedToTeamId?: string
  assignedToTeamName?: string

  // Category
  categoryId?: string
  categoryName?: string
  subcategoryId?: string
  subcategoryName?: string
  tags: string[]

  // SLA
  slaId?: string
  slaStatus?: SLAStatus
  slaBreached: boolean
  responseDeadline?: string
  resolutionDeadline?: string
  firstResponseAt?: string
  resolvedAt?: string

  // Resolution
  resolution?: string
  resolutionType?: 'fixed' | 'workaround' | 'duplicate' | 'cannot_reproduce' | 'by_design' | 'wont_fix'

  // Related
  relatedTickets: string[]
  parentTicketId?: string
  childTickets: string[]
  mergedIntoTicketId?: string

  // Attachments
  attachments: TicketAttachment[]

  // Activity
  commentsCount: number
  viewsCount: number
  lastActivityAt?: string

  // Ratings
  satisfactionRating?: number // 1-5
  satisfactionComment?: string
  ratedAt?: string

  // Time Tracking
  estimatedTime?: number // minutes
  timeSpent: number // minutes
  billableTime?: number // minutes

  // Channel (for multi-channel support)
  channelId?: string
  externalId?: string // ID from external system

  // Follow-up
  requiresFollowUp: boolean
  followUpDate?: string

  // Escalation
  isEscalated: boolean
  escalatedTo?: string
  escalatedAt?: string
  escalationLevel?: number

  // Custom Fields
  customFields?: Record<string, any>

  // Timestamps
  createdAt: string
  updatedAt: string
  closedAt?: string
  lastReopenedAt?: string
  reopenCount: number
}

export interface TicketComment {
  id: string
  ticketId: string

  // Comment
  content: string
  isInternal: boolean // internal note vs customer-visible

  // Author
  userId?: string
  userName: string
  userType: 'agent' | 'customer' | 'system'
  userAvatar?: string

  // Attachments
  attachments: TicketAttachment[]

  // Email
  isFromEmail: boolean
  emailMessageId?: string

  // Actions (for system comments)
  actionType?: 'status_change' | 'assignment' | 'priority_change' | 'merged' | 'linked'
  actionDetails?: Record<string, any>

  // Timestamps
  createdAt: string
  updatedAt: string
  isEdited: boolean
}

export interface TicketAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string

  uploadedBy: string
  uploadedByName: string
  uploadedAt: string
}

export interface SLA {
  id: string
  tenantId: string

  name: string
  description?: string

  // Priorities
  priorities: SLAPriorityRule[]

  // Coverage
  operatingHours: OperatingHours
  holidays: Holiday[]

  // Escalation
  escalationEnabled: boolean
  escalationRules: EscalationRule[]

  // Notifications
  notifyOnBreach: boolean
  notifyOnAtRisk: boolean
  warningThreshold: number // percentage (e.g., 80)

  // Application
  appliesTo: SLACondition

  isActive: boolean
  isDefault: boolean

  createdAt: string
  updatedAt: string
}

export interface SLAPriorityRule {
  priority: SLAPriority
  responseTime: number // minutes
  resolutionTime: number // minutes or hours
}

export interface OperatingHours {
  timezone: string
  schedule: DaySchedule[]
  is247: boolean
}

export interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  isWorkingDay: boolean
  startTime?: string // HH:mm format
  endTime?: string // HH:mm format
}

export interface Holiday {
  date: string // YYYY-MM-DD
  name: string
  isRecurring: boolean
}

export interface EscalationRule {
  level: number
  triggerAfter: number // minutes
  assignToUserId?: string
  assignToTeamId?: string
  notifyEmails?: string[]
}

export interface SLACondition {
  customerTiers?: string[]
  categories?: string[]
  priorities?: TicketPriority[]
  sources?: TicketSource[]
}

export interface TicketCategory {
  id: string
  tenantId: string

  name: string
  description?: string

  // Hierarchy
  parentId?: string
  path: string
  level: number

  // Auto-assignment
  autoAssignToUserId?: string
  autoAssignToTeamId?: string

  // SLA
  defaultSlaId?: string

  // Templates
  responseTemplates?: ResponseTemplate[]

  // Metrics
  ticketsCount: number
  avgResolutionTime?: number

  order: number
  isActive: boolean

  createdAt: string
  updatedAt: string
}

export interface ResponseTemplate {
  id: string
  tenantId: string

  name: string
  subject?: string
  content: string

  // Usage
  categoryId?: string
  tags: string[]

  // Variables
  variables: TemplateVariable[]

  // Attachments
  defaultAttachments?: string[]

  usageCount: number

  createdAt: string
  updatedAt: string
}

export interface TemplateVariable {
  key: string
  label: string
  defaultValue?: string
}

export interface KnowledgeBaseArticle {
  id: string
  tenantId: string

  // Article Info
  title: string
  slug: string
  content: string
  excerpt?: string

  status: ArticleStatus
  category: ArticleCategory

  // SEO
  metaTitle?: string
  metaDescription?: string
  keywords: string[]

  // Organization
  tags: string[]
  relatedArticles: string[]

  // Visibility
  isPublic: boolean
  requiresLogin: boolean
  allowedUserTiers?: string[]

  // Featured
  isFeatured: boolean
  featuredOrder?: number

  // Content
  tableOfContents?: TOCItem[]
  attachments: KBAttachment[]
  videoUrl?: string

  // Feedback
  helpful: number
  notHelpful: number
  helpfulnessRatio: number

  // Usage
  viewsCount: number
  searchImpressions: number
  linkedFromTickets: number

  // Author
  authorId: string
  authorName: string

  // Review
  reviewedBy?: string
  reviewedAt?: string
  nextReviewDate?: string

  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
  archivedAt?: string
}

export interface TOCItem {
  id: string
  title: string
  level: number // 1-6 for h1-h6
  anchor: string
}

export interface KBAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  downloadCount: number
}

export interface SupportTeam {
  id: string
  tenantId: string

  name: string
  description?: string
  email?: string

  // Members
  members: TeamMember[]
  leaderId?: string

  // Assignment
  assignmentMethod: 'round_robin' | 'load_balanced' | 'manual'
  maxTicketsPerAgent?: number

  // Coverage
  operatingHours?: OperatingHours

  // Metrics
  openTickets: number
  avgResponseTime: number
  avgResolutionTime: number

  isActive: boolean

  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  userId: string
  userName: string
  userEmail: string
  role: 'member' | 'lead' | 'admin'

  // Capacity
  maxTickets?: number
  currentTickets: number

  // Availability
  isAvailable: boolean
  availabilityStatus?: 'online' | 'busy' | 'away' | 'offline'

  // Skills
  skills: string[]
  categories: string[]

  joinedAt: string
}

export interface MacroAction {
  id: string
  tenantId: string

  name: string
  description?: string

  // Actions
  actions: Action[]

  // Conditions
  conditions?: Condition[]

  // Usage
  usageCount: number

  isActive: boolean

  createdAt: string
  updatedAt: string
}

export interface Action {
  type: 'set_status' | 'set_priority' | 'assign_to' | 'add_tag' | 'add_comment' | 'send_email' | 'set_field'
  value: any
  config?: Record<string, any>
}

export interface Condition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface Automation {
  id: string
  tenantId: string

  name: string
  description?: string

  // Trigger
  trigger: AutomationTrigger
  conditions: Condition[]

  // Actions
  actions: Action[]

  // Schedule
  isScheduled: boolean
  scheduleExpression?: string // cron expression

  // State
  isActive: boolean
  executionCount: number
  lastExecutedAt?: string

  createdAt: string
  updatedAt: string
}

export interface AutomationTrigger {
  type: 'ticket_created' | 'ticket_updated' | 'comment_added' | 'status_changed' | 'sla_breach' | 'schedule'
  config?: Record<string, any>
}

export interface CSAT {
  id: string
  ticketId: string
  customerId: string

  // Rating
  rating: number // 1-5
  comment?: string

  // Questions
  responses: CSATResponse[]

  // Metadata
  ratedAt: string
  source: 'email' | 'web' | 'sms'
}

export interface CSATResponse {
  question: string
  answer: string | number
  type: 'rating' | 'text' | 'choice'
}

export interface SupportAnalytics {
  // Volume
  totalTickets: number
  newTickets: number
  openTickets: number
  resolvedTickets: number
  closedTickets: number

  // Performance
  avgFirstResponseTime: number // minutes
  avgResolutionTime: number // minutes
  firstContactResolutionRate: number

  // SLA
  slaComplianceRate: number
  breachedTickets: number

  // Satisfaction
  avgCSAT: number
  csatResponseRate: number

  // Efficiency
  ticketsPerAgent: number
  resolutionRate: number
  reopenRate: number

  // Backlog
  backlogSize: number
  backlogGrowth: number

  // Channels
  ticketsBySource: SourceMetric[]

  // Trends
  ticketsByMonth: MonthlyMetric[]
  resolutionTimeByMonth: MonthlyMetric[]
  csatByMonth: MonthlyMetric[]

  // Categories
  ticketsByCategory: CategoryMetric[]

  // Agents
  agentPerformance: AgentMetric[]
}

export interface SourceMetric {
  source: string
  count: number
  percentage: number
}

export interface CategoryMetric {
  category: string
  count: number
  percentage: number
  avgResolutionTime: number
}

export interface AgentMetric {
  userId: string
  userName: string
  ticketsResolved: number
  avgResolutionTime: number
  csatScore: number
  slaCompliance: number
}

export interface MonthlyMetric {
  month: string
  value: number
}
