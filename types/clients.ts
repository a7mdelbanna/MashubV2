// ==========================================
// CLIENT TYPES & INTERFACES
// ==========================================

export type ClientStatus = 'lead' | 'prospect' | 'active' | 'inactive' | 'churned'
export type ClientType = 'individual' | 'company' | 'enterprise' | 'government'
export type ClientPriority = 'low' | 'medium' | 'high' | 'vip'
export type ClientSource = 'referral' | 'marketing' | 'sales' | 'website' | 'social' | 'event' | 'other'
export type ClientLifecycleStage = 'lead' | 'prospect' | 'customer' | 'advocate' | 'churned'
export type HealthLevel = 'critical' | 'at_risk' | 'healthy' | 'excellent'

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated' | 'renewed'
export type ContractType = 'one_time' | 'recurring' | 'retainer' | 'fixed_price' | 'time_materials'

export type CommunicationChannel = 'email' | 'phone' | 'meeting' | 'video_call' | 'chat' | 'social'
export type CommunicationType = 'call' | 'email' | 'meeting' | 'note' | 'task' | 'deal'

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface Client {
  id: string
  tenantId: string

  // Basic Info
  name: string
  legalName?: string
  type: ClientType
  taxId?: string

  // Status & Classification
  status: ClientStatus
  priority: ClientPriority
  source: ClientSource
  tags: string[]
  industry?: string
  size?: string // employees count or business size

  // Contact Details
  email: string
  phone?: string
  website?: string

  // Address
  address?: Address

  // Primary Contact
  primaryContactId?: string
  primaryContact?: ContactPerson

  // Logo & Branding
  logo?: string
  color?: string

  // Business Metrics
  totalRevenue: number
  lifetimeValue: number
  averageInvoiceValue: number
  outstandingBalance: number

  // Project Metrics
  totalProjects: number
  activeProjects: number
  completedProjects: number

  // Billing
  currency?: string
  paymentTerms?: number // days
  defaultBillingMethod?: string
  creditLimit?: number

  // Relationships
  assignedToUserId?: string
  assignedToUserName?: string
  accountManagerId?: string
  accountManagerName?: string

  // Activity
  lastContactDate?: string
  lastProjectDate?: string
  lastInvoiceDate?: string
  lastPaymentDate?: string

  // Custom Fields
  customFields?: Record<string, any>

  // Timestamps
  createdAt: string
  updatedAt: string
  onboardedAt?: string
  churnedAt?: string
}

export interface ContactPerson {
  id: string
  clientId: string

  // Personal Info
  firstName: string
  lastName: string
  fullName: string
  jobTitle?: string
  department?: string

  // Contact
  email: string
  phone?: string
  mobile?: string

  // Preferences
  isPrimary: boolean
  language?: string
  timezone?: string

  // Communication
  preferredChannel?: CommunicationChannel
  canReceiveMarketing: boolean

  // Social
  linkedIn?: string
  twitter?: string

  // Birthday & Personal
  birthday?: string
  notes?: string

  createdAt: string
  updatedAt: string
}

export interface Address {
  street?: string
  street2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  formatted?: string // full formatted address
}

export interface Contract {
  id: string
  clientId: string
  projectId?: string

  // Contract Details
  contractNumber: string
  title: string
  description: string
  type: ContractType
  status: ContractStatus

  // Financial
  value: number
  currency: string

  // Dates
  startDate: string
  endDate?: string
  signedDate?: string
  renewalDate?: string

  // Terms
  paymentTerms: number // days
  deliverables: string[]
  milestones: ContractMilestone[]

  // Documents
  documentUrl?: string
  signedDocumentUrl?: string

  // Parties
  clientSignature?: Signature
  companySignature?: Signature

  // Auto-renewal
  autoRenew: boolean
  renewalNoticeDays?: number

  // Metadata
  tags: string[]
  notes?: string

  createdAt: string
  updatedAt: string
  signedAt?: string
  expiredAt?: string
  terminatedAt?: string
}

export interface ContractMilestone {
  id: string
  name: string
  description?: string
  dueDate?: string
  value?: number
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  completedAt?: string
}

export interface Signature {
  signedBy: string
  signedByName: string
  signedAt: string
  ipAddress?: string
  signatureUrl?: string
}

export interface Communication {
  id: string
  clientId: string
  tenantId: string
  contactPersonId?: string

  // Communication Details
  type: CommunicationType
  channel: CommunicationChannel
  subject: string
  content: string

  // Direction
  direction: 'inbound' | 'outbound'

  // User
  userId: string
  userName: string

  // Attachments
  attachments: CommunicationAttachment[]

  // Scheduling (for future communications)
  scheduledFor?: string
  completedAt?: string

  // Follow-up
  requiresFollowUp: boolean
  followUpDate?: string
  followUpCompleted: boolean

  // Metadata
  duration?: number // for calls/meetings in minutes
  tags: string[]

  createdAt: string
  updatedAt: string
}

export interface CommunicationAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
}

export interface ClientInvoice {
  id: string
  clientId: string
  projectId?: string
  contractId?: string

  // Invoice Details
  invoiceNumber: string
  title: string
  description?: string
  status: InvoiceStatus

  // Financial
  subtotal: number
  tax: number
  discount: number
  total: number
  amountPaid: number
  amountDue: number
  currency: string

  // Line Items
  items: InvoiceItem[]

  // Dates
  issueDate: string
  dueDate: string
  paidDate?: string

  // Payment
  paymentStatus: PaymentStatus
  paymentMethod?: string
  paymentReference?: string

  // Notes
  notes?: string
  termsAndConditions?: string

  // Documents
  pdfUrl?: string

  // Reminders
  remindersSent: number
  lastReminderDate?: string

  createdAt: string
  updatedAt: string
  sentAt?: string
  viewedAt?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  taxRate?: number
  taxAmount?: number
}

export interface ClientProject {
  id: string
  clientId: string

  name: string
  status: string
  priority: string

  startDate?: string
  endDate?: string

  value?: number
  currency?: string

  completionPercentage: number

  teamSize: number
  managerId?: string
  managerName?: string

  createdAt: string
  updatedAt: string
}

export interface ClientActivity {
  id: string
  clientId: string
  tenantId: string

  type: 'created' | 'updated' | 'communication' | 'project' | 'invoice' | 'payment' | 'contract' | 'note'
  title: string
  description: string

  // User
  userId?: string
  userName?: string

  // Reference
  entityType?: string
  entityId?: string

  // Metadata
  metadata?: Record<string, any>

  createdAt: string
}

export interface ClientNote {
  id: string
  clientId: string
  tenantId: string

  title?: string // Optional title for the note
  content: string

  // User
  createdBy: string
  createdByName: string

  // Visibility
  isPrivate: boolean
  isPinned: boolean

  // Attachments
  attachments: CommunicationAttachment[]

  createdAt: string
  updatedAt: string
}

export interface ClientDocument {
  id: string
  clientId: string
  tenantId: string

  // File names
  name: string // Sanitized filename for storage
  originalName: string // Original filename

  // File metadata
  size: number
  type: string // MIME type
  category?: 'contract' | 'invoice' | 'proposal' | 'report' | 'other'

  // Firebase Storage
  storagePath: string // Path in Firebase Storage
  downloadURL: string // Public download URL

  // Upload info
  uploadedBy: string
  uploadedByName: string

  // Optional metadata
  description?: string
  tags?: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface ClientAnalytics {
  clientId: string

  // Revenue
  totalRevenue: number
  revenueThisYear: number
  revenueThisMonth: number
  revenueGrowth: number

  // Projects
  projectsTotal: number
  projectsActive: number
  projectsCompleted: number
  avgProjectValue: number

  // Invoices
  invoicesTotal: number
  invoicesPaid: number
  invoicesOverdue: number
  avgPaymentDays: number

  // Engagement
  communicationsCount: number
  lastCommunicationDays: number
  meetingsCount: number

  // Health Score
  healthScore: number // 0-100
  churnRisk: 'low' | 'medium' | 'high'
  satisfactionScore?: number

  // Trends
  revenueByMonth: MonthlyMetric[]
  communicationsByMonth: MonthlyMetric[]
}

export interface MonthlyMetric {
  month: string // YYYY-MM
  value: number
}
