// ==========================================
// SERVICE TYPES & INTERFACES
// ==========================================

export type ServiceStatus = 'draft' | 'active' | 'inactive' | 'discontinued'
export type ServiceType = 'one_time' | 'recurring' | 'subscription' | 'retainer'
export type ServiceCategory = 'consulting' | 'development' | 'design' | 'marketing' | 'support' | 'training' | 'other'

export type PricingModel = 'fixed' | 'hourly' | 'daily' | 'project_based' | 'value_based' | 'tiered'
export type BillingCycle = 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'custom'

export type DeliveryStatus = 'not_started' | 'in_progress' | 'delivered' | 'accepted' | 'rejected'
export type ResourceType = 'human' | 'equipment' | 'software' | 'facility'

export type SLAStatus = 'active' | 'breached' | 'at_risk' | 'met'
export type SLAPriority = 'low' | 'medium' | 'high' | 'critical'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface Service {
  id: string
  tenantId: string

  // Basic Info
  name: string
  slug: string
  code: string
  description: string
  shortDescription?: string

  // Type & Category
  type: ServiceType
  category: ServiceCategory
  status: ServiceStatus

  // Classification
  tags: string[]
  keywords: string[]

  // Pricing
  pricingModel: PricingModel
  basePrice: number
  currency: string

  // For hourly/daily rates
  hourlyRate?: number
  dailyRate?: number

  // For subscriptions
  billingCycle?: BillingCycle
  setupFee?: number
  cancellationFee?: number

  // Tiered Pricing
  pricingTiers?: ServiceTier[]

  // Delivery
  estimatedDeliveryDays?: number
  maxDeliveryDays?: number
  minDeliveryDays?: number

  // Requirements
  requiresConsultation: boolean
  requiresQuote: boolean
  requiresApproval: boolean

  // Dependencies
  dependencies: ServiceDependency[]
  prerequisites: string[]

  // Resources Required
  resources: ServiceResource[]

  // Packages (bundling services)
  isPackage: boolean
  packageItems?: PackageItem[]

  // Add-ons
  addOns: ServiceAddOn[]

  // Deliverables
  deliverables: Deliverable[]

  // SLA
  hasSLA: boolean
  sla?: ServiceSLA

  // Images & Media
  imageUrl?: string
  galleryImages?: string[]
  videoUrl?: string

  // Metrics
  totalSales: number
  totalRevenue: number
  averageRating?: number
  reviewsCount: number
  activeSubscriptions?: number

  // SEO
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]

  // Visibility
  isPublished: boolean
  isFeatured: boolean
  requiresLogin: boolean

  // Custom Fields
  customFields?: Record<string, any>

  // Team
  defaultAssigneeId?: string
  teamMembers: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
  discontinuedAt?: string
}

export interface ServiceTier {
  id: string
  name: string
  description: string

  price: number
  billingCycle?: BillingCycle

  features: TierFeature[]

  // Limits
  maxUsers?: number
  maxProjects?: number
  maxStorage?: number // in GB
  customLimits?: Record<string, number>

  // Discounts
  annualDiscount?: number // percentage

  isPopular: boolean
  order: number
}

export interface TierFeature {
  id: string
  name: string
  description?: string
  included: boolean
  limit?: number | string
  isHighlighted: boolean
}

export interface ServiceDependency {
  serviceId: string
  serviceName: string
  isRequired: boolean
  order: number
}

export interface ServiceResource {
  id: string
  type: ResourceType
  name: string
  description?: string

  // Availability
  isRequired: boolean
  quantity: number
  unit?: string

  // For human resources
  skillLevel?: 'junior' | 'mid' | 'senior' | 'expert'
  hourlyRate?: number

  // For equipment/software
  costPerHour?: number
  costPerDay?: number
}

export interface PackageItem {
  serviceId: string
  serviceName: string
  quantity: number
  discountPercentage?: number
  isCustomizable: boolean
  isOptional: boolean
}

export interface ServiceAddOn {
  id: string
  name: string
  description: string

  price: number
  pricingModel: 'fixed' | 'hourly' | 'percentage'

  isOptional: boolean
  order: number
}

export interface Deliverable {
  id: string
  name: string
  description: string
  type: 'document' | 'code' | 'design' | 'training' | 'report' | 'other'

  estimatedDays?: number
  isRequired: boolean
  order: number
}

export interface ServiceSLA {
  responseTime: number // minutes
  resolutionTime: number // hours
  uptime: number // percentage (e.g., 99.9)
  supportHours: string // e.g., "24/7", "Business Hours"

  // Penalties
  penaltyPercentage?: number
  penaltyMaxAmount?: number

  // Escalation
  escalationLevels?: EscalationLevel[]
}

export interface EscalationLevel {
  level: number
  timeThreshold: number // minutes
  assignToUserId?: string
  assignToRole?: string
  notifyEmails?: string[]
}

export interface ServiceDelivery {
  id: string
  serviceId: string
  projectId?: string
  clientId: string

  // Order Info
  orderNumber: string
  status: DeliveryStatus

  // Deliverables
  completedDeliverables: string[]
  totalDeliverables: number
  completionPercentage: number

  // Dates
  startDate: string
  expectedDeliveryDate: string
  actualDeliveryDate?: string

  // Quality
  qualityCheckStatus?: 'pending' | 'passed' | 'failed'
  qualityScore?: number

  // Client Acceptance
  acceptedBy?: string
  acceptedAt?: string
  rejectedReason?: string
  revisionRequests: RevisionRequest[]

  // Resources Used
  hoursSpent: number
  resourceCost: number

  // Team
  assignedTeam: string[]
  leadUserId?: string

  // Documents
  attachments: DeliveryAttachment[]

  // Notes
  notes?: string

  createdAt: string
  updatedAt: string
  deliveredAt?: string
}

export interface RevisionRequest {
  id: string
  requestedBy: string
  requestedByName: string
  requestedAt: string

  description: string
  priority: 'low' | 'medium' | 'high'

  status: 'pending' | 'in_progress' | 'completed'

  completedBy?: string
  completedAt?: string

  attachments?: DeliveryAttachment[]
}

export interface DeliveryAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  uploadedBy: string
  uploadedAt: string
}

export interface ServiceSubscription {
  id: string
  clientId: string
  serviceId: string
  tierId?: string

  // Subscription Info
  subscriptionNumber: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'

  // Billing
  billingCycle: BillingCycle
  amount: number
  currency: string
  nextBillingDate: string

  // Dates
  startDate: string
  endDate?: string
  cancelledAt?: string
  pausedAt?: string

  // Payment
  paymentMethodId?: string
  autoRenew: boolean

  // Usage (for metered services)
  usageLimit?: number
  currentUsage?: number

  // Discount
  discountCode?: string
  discountAmount?: number
  discountPercentage?: number

  // Trial
  trialEndsAt?: string
  isTrialActive: boolean

  // Metrics
  totalPayments: number
  totalRevenue: number
  missedPayments: number

  // Notes
  notes?: string

  createdAt: string
  updatedAt: string
}

export interface ServiceReview {
  id: string
  serviceId: string
  clientId: string
  deliveryId?: string

  // Rating
  rating: number // 1-5
  title: string
  comment: string

  // Categories
  qualityRating?: number
  timelinessRating?: number
  communicationRating?: number
  valueRating?: number

  // Status
  isVerified: boolean
  isPublished: boolean

  // Response
  response?: string
  respondedBy?: string
  respondedAt?: string

  // Helpful
  helpfulCount: number
  notHelpfulCount: number

  createdAt: string
  updatedAt: string
}

export interface ServiceTemplate {
  id: string
  serviceId: string

  name: string
  description: string
  type: 'proposal' | 'contract' | 'scope_of_work' | 'invoice' | 'report'

  // Template Content
  content: string // HTML or markdown
  variables: TemplateVariable[]

  // Settings
  isDefault: boolean
  isActive: boolean

  createdAt: string
  updatedAt: string
}

export interface TemplateVariable {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'list'
  defaultValue?: any
  isRequired: boolean
}

export interface ServiceReport {
  id: string
  serviceId: string
  deliveryId?: string

  title: string
  type: 'monthly' | 'quarterly' | 'annual' | 'custom'

  // Period
  startDate: string
  endDate: string

  // Metrics
  metrics: ReportMetric[]

  // Content
  summary: string
  details: string
  recommendations?: string[]

  // Attachments
  attachments: DeliveryAttachment[]

  // Generation
  generatedBy: string
  generatedAt: string

  // Status
  status: 'draft' | 'final' | 'sent'
  sentAt?: string

  createdAt: string
}

export interface ReportMetric {
  key: string
  label: string
  value: number | string
  unit?: string
  change?: number // percentage change
  trend?: 'up' | 'down' | 'stable'
}

export interface ServiceAnalytics {
  serviceId: string

  // Sales
  totalSales: number
  salesThisMonth: number
  revenue: number
  revenueThisMonth: number

  // Subscriptions (if applicable)
  activeSubscriptions: number
  newSubscriptions: number
  churnedSubscriptions: number
  churnRate: number

  // Delivery
  avgDeliveryTime: number
  onTimeDeliveryRate: number
  clientSatisfaction: number

  // Profitability
  avgCost: number
  avgProfit: number
  profitMargin: number

  // Trends
  salesByMonth: MonthlyMetric[]
  revenueByMonth: MonthlyMetric[]
  subscriptionsByMonth: MonthlyMetric[]
}

export interface MonthlyMetric {
  month: string
  value: number
}
