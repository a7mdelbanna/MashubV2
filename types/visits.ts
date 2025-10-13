// ==========================================
// VISIT TYPES & INTERFACES
// ==========================================

export type VisitStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type VisitType = 'sales' | 'support' | 'delivery' | 'inspection' | 'training' | 'consultation' | 'followup' | 'other'
export type VisitPriority = 'low' | 'normal' | 'high' | 'urgent'

export type CheckInMethod = 'manual' | 'gps' | 'qr_code' | 'nfc'
export type TransportMode = 'car' | 'public_transport' | 'walking' | 'bike' | 'company_vehicle' | 'other'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface Visit {
  id: string
  tenantId: string

  // Visit Info
  visitNumber: string
  title: string
  description?: string
  type: VisitType
  status: VisitStatus
  priority: VisitPriority

  // Client/Location
  clientId?: string
  clientName?: string
  locationId?: string
  locationName?: string

  // Address
  address: VisitAddress

  // Contact Person
  contactPerson?: ContactPerson

  // Schedule
  scheduledDate: string
  scheduledStartTime: string
  scheduledEndTime: string
  estimatedDuration: number // minutes

  // Actual Times
  actualStartTime?: string
  actualEndTime?: string
  actualDuration?: number // minutes

  // Assignment
  assignedToUserId: string
  assignedToUserName: string
  assignedTeam?: string[]

  // Check-in/Check-out
  checkInTime?: string
  checkInLocation?: GeoLocation
  checkInMethod?: CheckInMethod
  checkInNotes?: string

  checkOutTime?: string
  checkOutLocation?: GeoLocation
  checkOutNotes?: string

  // Travel
  transportMode?: TransportMode
  estimatedTravelTime?: number // minutes
  actualTravelTime?: number // minutes
  distance?: number // km
  travelCost?: number

  // Purpose & Tasks
  purpose: string
  objectives: string[]
  tasks: VisitTask[]

  // Outcomes
  outcome?: string
  summary?: string
  nextSteps?: string[]

  // Attendees
  attendees: VisitAttendee[]

  // Documents & Media
  photos: VisitPhoto[]
  documents: VisitDocument[]
  signatures: VisitSignature[]

  // Forms & Checklists
  checklistId?: string
  checklistCompleted: boolean
  checklistData?: Record<string, any>

  // Customer Satisfaction
  satisfactionRating?: number // 1-5
  customerFeedback?: string

  // Financial
  estimatedRevenue?: number
  actualRevenue?: number
  expenses: VisitExpense[]

  // Follow-up
  requiresFollowUp: boolean
  followUpDate?: string
  followUpNotes?: string

  // Notifications
  remindersSent: number
  lastReminderDate?: string

  // Recurring
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern

  // Metadata
  tags: string[]
  customFields?: Record<string, any>

  // Weather (captured at visit time)
  weather?: WeatherInfo

  // Timestamps
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
}

export interface VisitAddress {
  street?: string
  street2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  formatted?: string
  latitude?: number
  longitude?: number
  placeId?: string // Google Places ID
}

export interface Contact Person {
  name: string
  title?: string
  email?: string
  phone?: string
  mobile?: string
}

export interface GeoLocation {
  latitude: number
  longitude: number
  accuracy?: number // meters
  timestamp: string
}

export interface VisitTask {
  id: string
  description: string
  isCompleted: boolean
  completedAt?: string
  notes?: string
  order: number
}

export interface VisitAttendee {
  id: string
  type: 'internal' | 'client' | 'guest'

  name: string
  email?: string
  role?: string

  attended: boolean
  signature?: string // signature URL
  signedAt?: string
}

export interface VisitPhoto {
  id: string
  url: string
  thumbnailUrl?: string
  caption?: string
  category?: string // e.g., "before", "after", "damage", "product"

  // Location
  latitude?: number
  longitude?: number

  // Metadata
  takenAt: string
  takenBy: string
  fileSize: number
}

export interface VisitDocument {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string

  category?: string
  description?: string

  uploadedBy: string
  uploadedAt: string
}

export interface VisitSignature {
  id: string
  signedBy: string
  signedByName: string
  signedByRole?: string
  signatureUrl: string
  signedAt: string

  type: 'customer' | 'employee' | 'witness'
  documentName?: string
}

export interface VisitExpense {
  id: string
  type: 'fuel' | 'parking' | 'meals' | 'accommodation' | 'materials' | 'tolls' | 'other'
  description: string

  amount: number
  currency: string

  // Receipt
  receiptUrl?: string
  receiptNumber?: string

  // Approval
  isApproved: boolean
  approvedBy?: string
  approvedAt?: string

  createdAt: string
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'custom'
  interval: number // every X days/weeks/months

  // For weekly
  daysOfWeek?: number[] // 0=Sunday, 1=Monday, etc.

  // For monthly
  dayOfMonth?: number
  weekOfMonth?: number // 1-5

  // End
  endType: 'never' | 'after_count' | 'until_date'
  endCount?: number
  endDate?: string

  // Generated visits
  totalGenerated: number
  nextScheduledDate?: string
}

export interface WeatherInfo {
  condition: string // e.g., "Sunny", "Rainy", "Cloudy"
  temperature: number
  temperatureUnit: 'C' | 'F'
  humidity: number // percentage
  windSpeed: number
  windSpeedUnit: 'kmh' | 'mph'
  precipitation?: number
}

export interface VisitTemplate {
  id: string
  tenantId: string

  name: string
  description?: string
  type: VisitType

  // Default Values
  defaultDuration: number // minutes
  defaultObjectives: string[]
  defaultTasks: TemplateTask[]

  // Checklists
  checklistId?: string

  // Required Fields
  requiredFields: string[]

  // Forms
  customFormFields?: FormField[]

  isActive: boolean
  usageCount: number

  createdAt: string
  updatedAt: string
}

export interface TemplateTask {
  description: string
  order: number
  isRequired: boolean
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'date' | 'time' | 'checkbox' | 'radio' | 'select' | 'textarea' | 'signature' | 'photo'
  options?: string[] // for select/radio
  isRequired: boolean
  order: number
  helpText?: string
}

export interface VisitChecklist {
  id: string
  tenantId: string

  name: string
  description?: string
  category?: string

  items: ChecklistItem[]

  // Settings
  requireAllCompleted: boolean
  allowComments: boolean
  allowPhotos: boolean

  isActive: boolean
  usageCount: number

  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  description: string
  order: number

  // Type
  type: 'checkbox' | 'text' | 'number' | 'date' | 'photo' | 'signature'

  // Validation
  isRequired: boolean
  minValue?: number
  maxValue?: number

  // Options
  expectedValue?: any
  acceptableValues?: any[]

  // Help
  instructions?: string
  referenceImageUrl?: string
}

export interface VisitReport {
  id: string
  visitId: string

  // Report Info
  reportNumber: string
  title: string
  type: 'summary' | 'detailed' | 'inspection' | 'service' | 'sales'

  // Content
  summary: string
  findings: string
  recommendations: string[]
  nextSteps?: string[]

  // Issues
  issuesFound: ReportIssue[]

  // Metrics
  metrics: ReportMetric[]

  // Attachments
  photos: VisitPhoto[]
  documents: VisitDocument[]

  // Generation
  generatedBy: string
  generatedByName: string
  generatedAt: string

  // Distribution
  sharedWith: string[]
  sentToClient: boolean
  sentAt?: string

  // Customer Approval
  requiresApproval: boolean
  approvedBy?: string
  approvedAt?: string

  createdAt: string
}

export interface ReportIssue {
  id: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  recommendation?: string
  photoUrls?: string[]
}

export interface ReportMetric {
  key: string
  label: string
  value: number | string
  unit?: string
  status?: 'good' | 'warning' | 'critical'
}

export interface VisitRoute {
  id: string
  tenantId: string

  name: string
  description?: string
  date: string

  // Route Details
  startLocation?: VisitAddress
  endLocation?: VisitAddress
  visits: string[] // visit IDs in order

  // Assignment
  assignedToUserId: string
  assignedToUserName: string

  // Optimization
  isOptimized: boolean
  optimizedAt?: string
  optimizationCriteria?: 'time' | 'distance' | 'priority'

  // Metrics
  totalVisits: number
  completedVisits: number
  totalDistance: number // km
  estimatedDuration: number // minutes
  actualDuration?: number // minutes

  // Status
  status: 'planned' | 'in_progress' | 'completed'

  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface VisitAnalytics {
  // Totals
  totalVisits: number
  visitsThisMonth: number
  completedVisits: number
  cancelledVisits: number

  // Completion
  completionRate: number
  avgCompletionTime: number // minutes
  onTimeRate: number

  // Efficiency
  avgTravelTime: number // minutes
  avgDistancePerVisit: number // km
  visitsPerDay: number

  // Customer
  avgSatisfactionRating: number
  repeatVisitRate: number

  // Financial
  totalRevenue: number
  avgRevenuePerVisit: number
  totalExpenses: number

  // Performance
  noShowRate: number
  rescheduleRate: number

  // Trends
  visitsByMonth: MonthlyMetric[]
  completionRateByMonth: MonthlyMetric[]
  satisfactionByMonth: MonthlyMetric[]

  // By Type
  visitsByType: TypeMetric[]

  // By User
  visitsByUser: UserMetric[]
}

export interface MonthlyMetric {
  month: string
  value: number
}

export interface TypeMetric {
  type: string
  count: number
  percentage: number
}

export interface UserMetric {
  userId: string
  userName: string
  count: number
  completionRate: number
  avgSatisfaction: number
}
