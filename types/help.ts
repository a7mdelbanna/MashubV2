// Help & Support Types
// Knowledge base, documentation, and support ticket system

export type ArticleStatus = 'draft' | 'published' | 'archived'
export type ArticleCategory = 'getting_started' | 'features' | 'integrations' | 'troubleshooting' | 'billing' | 'api' | 'security' | 'mobile'
export type TicketStatus = 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketType = 'question' | 'bug' | 'feature_request' | 'technical_issue' | 'billing' | 'account' | 'other'
export type ContentType = 'article' | 'video' | 'tutorial' | 'guide' | 'faq'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

// Knowledge Base Article
export interface Article {
  id: string
  tenantId: string

  // Content
  title: string
  slug: string
  content: string // Markdown content
  excerpt: string
  category: ArticleCategory
  subcategory?: string
  type: ContentType
  difficulty?: DifficultyLevel

  // SEO & Discovery
  tags: string[]
  keywords: string[]
  relatedArticles: string[] // Article IDs

  // Metadata
  status: ArticleStatus
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  averageReadTime: number // in minutes

  // Media
  coverImage?: string
  videoUrl?: string
  attachments?: Attachment[]

  // Author & Timestamps
  authorId: string
  authorName: string
  publishedAt?: string
  lastUpdatedAt: string
  createdAt: string
}

// FAQ Item
export interface FAQ {
  id: string
  tenantId: string
  question: string
  answer: string
  category: ArticleCategory
  order: number
  isPopular: boolean
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  relatedArticles: string[]
  createdAt: string
  updatedAt: string
}

// Support Ticket
export interface SupportTicket {
  id: string
  tenantId: string
  ticketNumber: string

  // Basic Info
  subject: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority

  // User Information
  requesterId: string
  requesterName: string
  requesterEmail: string

  // Assignment
  assignedTo?: {
    agentId: string
    agentName: string
    agentEmail: string
  }
  team?: string

  // Communication
  messages: TicketMessage[]
  internalNotes: InternalNote[]

  // Attachments
  attachments: Attachment[]

  // Resolution
  resolution?: string
  resolvedAt?: string
  resolvedBy?: string

  // Tracking
  firstResponseAt?: string
  lastResponseAt?: string
  responseTime?: number // in minutes
  resolutionTime?: number // in minutes

  // Metadata
  tags: string[]
  customFields?: Record<string, any>
  satisfaction?: {
    rating: number // 1-5
    feedback?: string
    submittedAt: string
  }

  // Timestamps
  createdAt: string
  updatedAt: string
  closedAt?: string
}

// Ticket Message
export interface TicketMessage {
  id: string
  ticketId: string
  senderId: string
  senderName: string
  senderType: 'customer' | 'agent' | 'system'
  content: string
  isPrivate: boolean
  attachments?: Attachment[]
  createdAt: string
}

// Internal Note
export interface InternalNote {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

// Attachment
export interface Attachment {
  id: string
  name: string
  url: string
  size: number // in bytes
  type: string
  uploadedBy: string
  uploadedAt: string
}

// Documentation Section
export interface DocumentationSection {
  id: string
  tenantId: string
  title: string
  description: string
  icon: string
  order: number
  articles: Article[]
  subsections?: DocumentationSection[]
  isExpanded?: boolean
}

// Video Tutorial
export interface VideoTutorial {
  id: string
  tenantId: string
  title: string
  description: string
  videoUrl: string
  thumbnail: string
  duration: number // in seconds
  category: ArticleCategory
  difficulty: DifficultyLevel
  tags: string[]
  viewCount: number
  likeCount: number
  transcriptUrl?: string
  relatedArticles: string[]
  createdAt: string
  publishedAt: string
}

// Tutorial Series
export interface TutorialSeries {
  id: string
  tenantId: string
  title: string
  description: string
  coverImage: string
  difficulty: DifficultyLevel
  category: ArticleCategory
  videos: VideoTutorial[]
  totalDuration: number
  completionRate?: number
  createdAt: string
}

// Help Category
export interface HelpCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  articleCount: number
  order: number
}

// Search Result
export interface SearchResult {
  id: string
  type: 'article' | 'faq' | 'video' | 'ticket'
  title: string
  excerpt: string
  url: string
  category: ArticleCategory
  relevanceScore: number
  highlightedContent?: string
}

// Help Analytics
export interface HelpAnalytics {
  totalArticles: number
  publishedArticles: number
  totalViews: number
  totalSearches: number
  avgReadTime: number
  topArticles: {
    articleId: string
    title: string
    views: number
    helpfulPercentage: number
  }[]
  topSearches: {
    query: string
    count: number
    resultsFound: number
  }[]
  categoryBreakdown: Record<ArticleCategory, number>
  ticketStats: {
    total: number
    open: number
    resolved: number
    avgResponseTime: number
    avgResolutionTime: number
    satisfactionScore: number
  }
}

// Support Agent
export interface SupportAgent {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  team: string
  status: 'online' | 'away' | 'offline'
  activeTickets: number
  resolvedTickets: number
  avgResponseTime: number
  avgResolutionTime: number
  satisfactionRating: number
  specialties: string[]
}

// Live Chat Session
export interface ChatSession {
  id: string
  tenantId: string
  userId: string
  userName: string
  userEmail: string
  agentId?: string
  agentName?: string
  status: 'waiting' | 'active' | 'ended'
  messages: ChatMessage[]
  startedAt: string
  endedAt?: string
  duration?: number
  rating?: number
  feedback?: string
}

// Chat Message
export interface ChatMessage {
  id: string
  sessionId: string
  senderId: string
  senderName: string
  senderType: 'user' | 'agent' | 'bot'
  content: string
  timestamp: string
  isRead: boolean
}

// Contact Form Submission
export interface ContactSubmission {
  id: string
  tenantId: string
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  type: 'general' | 'sales' | 'support' | 'partnership' | 'feedback'
  status: 'new' | 'in_progress' | 'responded' | 'closed'
  assignedTo?: string
  response?: string
  respondedAt?: string
  createdAt: string
}

// Release Notes
export interface ReleaseNote {
  id: string
  tenantId: string
  version: string
  releaseDate: string
  title: string
  description: string
  features: ReleaseItem[]
  improvements: ReleaseItem[]
  bugFixes: ReleaseItem[]
  breaking?: ReleaseItem[]
  isPublished: boolean
  publishedAt?: string
  createdAt: string
}

// Release Item
export interface ReleaseItem {
  id: string
  title: string
  description: string
  category?: string
  relatedArticle?: string
}

// System Status
export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'outage'
  lastUpdated: string
  services: ServiceStatus[]
  incidents: Incident[]
  maintenances: Maintenance[]
}

// Service Status
export interface ServiceStatus {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'down' | 'maintenance'
  uptime: number // percentage
  responseTime: number // ms
  lastChecked: string
}

// Incident
export interface Incident {
  id: string
  title: string
  description: string
  severity: 'critical' | 'major' | 'minor'
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  affectedServices: string[]
  updates: IncidentUpdate[]
  startedAt: string
  resolvedAt?: string
}

// Incident Update
export interface IncidentUpdate {
  id: string
  status: Incident['status']
  message: string
  timestamp: string
}

// Scheduled Maintenance
export interface Maintenance {
  id: string
  title: string
  description: string
  affectedServices: string[]
  scheduledStart: string
  scheduledEnd: string
  status: 'scheduled' | 'in_progress' | 'completed'
  impact: 'none' | 'low' | 'medium' | 'high'
}
