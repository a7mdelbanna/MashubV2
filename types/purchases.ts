// ==========================================
// PURCHASE TYPES & INTERFACES
// ==========================================

export type PurchaseStatus = 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'partial' | 'received' | 'cancelled'
export type PurchaseType = 'goods' | 'services' | 'assets' | 'subscriptions'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated'

export type ReceivingStatus = 'pending' | 'partial' | 'complete' | 'discrepancy'
export type QualityStatus = 'pending' | 'passed' | 'failed' | 'conditional'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue'
export type PaymentMethod = 'wire' | 'check' | 'credit_card' | 'ach' | 'cash' | 'other'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface Purchase {
  id: string
  tenantId: string

  // Purchase Info
  purchaseNumber: string
  type: PurchaseType
  status: PurchaseStatus

  // Vendor
  vendorId: string
  vendorName: string
  vendorEmail?: string
  vendorPhone?: string

  // Requestor
  requestedBy: string
  requestedByName: string
  department?: string
  costCenter?: string

  // Items
  items: PurchaseItem[]

  // Financial
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string

  // Payment
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  paymentTerms: number // days
  paidAmount: number
  dueDate?: string

  // Approval Workflow
  approvalStatus: ApprovalStatus
  approvalChain: ApprovalStep[]
  currentApproverId?: string

  // Delivery
  shippingAddress?: string
  billingAddress?: string
  expectedDeliveryDate?: string
  actualDeliveryDate?: string
  shippingMethod?: string
  trackingNumber?: string

  // Receiving
  receivingStatus?: ReceivingStatus
  receivedQuantity: number
  totalQuantity: number

  // Quality Control
  qualityCheckRequired: boolean
  qualityStatus?: QualityStatus

  // Documents
  requisitionUrl?: string
  purchaseOrderUrl?: string
  invoiceUrl?: string
  receiptUrl?: string

  // Notes
  notes?: string
  internalNotes?: string
  vendorNotes?: string

  // Timestamps
  createdAt: string
  updatedAt: string
  orderedAt?: string
  receivedAt?: string
  approvedAt?: string
  cancelledAt?: string
}

export interface PurchaseItem {
  id: string
  type: 'product' | 'service' | 'custom'

  // Product Reference
  productId?: string
  variantId?: string
  productName: string
  sku?: string
  description?: string

  // Quantity
  quantity: number
  receivedQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number

  // Unit
  unit: string // e.g., "each", "box", "kg"

  // Pricing
  unitPrice: number
  totalPrice: number

  // Tax
  taxRate?: number
  taxAmount?: number

  // Delivery
  expectedDate?: string
  actualDeliveryDate?: string

  // Quality
  qualityStatus?: QualityStatus
  qualityNotes?: string

  // Notes
  notes?: string
}

export interface ApprovalStep {
  level: number
  approverId: string
  approverName: string
  approverRole?: string

  status: ApprovalStatus
  decision?: 'approved' | 'rejected'

  comments?: string
  conditions?: string[]

  requestedAt: string
  respondedAt?: string
  remindersSent: number
}

export interface ReceivingRecord {
  id: string
  purchaseId: string

  // Receiving Info
  receivingNumber: string
  receivedBy: string
  receivedByName: string
  receivedAt: string

  // Items
  items: ReceivingItem[]

  // Quality Check
  qualityCheckPerformed: boolean
  qualityCheckBy?: string
  qualityCheckAt?: string
  qualityStatus?: QualityStatus

  // Warehouse
  warehouseId?: string
  warehouseName?: string

  // Discrepancies
  hasDiscrepancies: boolean
  discrepancies: Discrepancy[]

  // Documents
  packingSlipUrl?: string
  photoUrls?: string[]

  // Notes
  notes?: string

  createdAt: string
}

export interface ReceivingItem {
  purchaseItemId: string
  productId?: string
  productName: string

  expectedQuantity: number
  receivedQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number

  qualityStatus: QualityStatus
  qualityNotes?: string

  // Location
  binLocation?: string
  warehouseSection?: string
}

export interface Discrepancy {
  id: string
  type: 'quantity_short' | 'quantity_excess' | 'wrong_item' | 'damaged' | 'quality_issue'
  description: string

  productId?: string
  productName?: string

  expectedQuantity?: number
  actualQuantity?: number

  resolution?: 'return' | 'credit' | 'replace' | 'accept_as_is'
  resolutionNotes?: string
  resolvedAt?: string

  photoUrls?: string[]
}

export interface QualityCheck {
  id: string
  purchaseId: string
  receivingRecordId: string

  // Inspection
  inspectedBy: string
  inspectedByName: string
  inspectedAt: string

  // Results
  overallStatus: QualityStatus
  score?: number // 0-100

  // Checks
  checks: QualityCheckItem[]

  // Actions
  actionRequired: boolean
  actionTaken?: string
  notifiedVendor: boolean

  // Documents
  reportUrl?: string
  photoUrls?: string[]

  notes?: string

  createdAt: string
}

export interface QualityCheckItem {
  checkName: string
  criteria: string
  result: 'pass' | 'fail' | 'conditional'
  notes?: string
  photoUrl?: string
}

export interface PurchaseBudget {
  id: string
  tenantId: string

  name: string
  description?: string

  // Period
  period: 'monthly' | 'quarterly' | 'annual'
  startDate: string
  endDate: string

  // Amounts
  allocatedAmount: number
  spentAmount: number
  committedAmount: number // approved but not spent
  availableAmount: number
  currency: string

  // Categories
  categoryBreakdown: BudgetCategory[]

  // Department/Cost Center
  departmentId?: string
  costCenter?: string

  // Owner
  ownerId: string
  ownerName: string

  // Alerts
  alertThreshold: number // percentage (e.g., 80)
  alertsSent: number

  createdAt: string
  updatedAt: string
}

export interface BudgetCategory {
  category: string
  allocated: number
  spent: number
  percentage: number
}

export interface PurchaseRequisition {
  id: string
  tenantId: string

  requisitionNumber: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'converted' | 'cancelled'

  // Requestor
  requestedBy: string
  requestedByName: string
  department?: string

  // Items
  items: RequisitionItem[]

  // Purpose
  purpose: string
  justification?: string
  urgency: 'low' | 'normal' | 'high' | 'urgent'

  // Financial
  estimatedTotal: number
  currency: string
  budgetId?: string

  // Preferred Vendor
  preferredVendorId?: string
  preferredVendorName?: string

  // Delivery
  requiredByDate?: string
  deliveryAddress?: string

  // Approval
  approvalStatus: ApprovalStatus
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string

  // Conversion
  convertedToPurchaseId?: string
  convertedAt?: string

  createdAt: string
  updatedAt: string
}

export interface RequisitionItem {
  id: string
  description: string
  specification?: string

  quantity: number
  unit: string

  estimatedUnitPrice?: number
  estimatedTotal?: number

  // Product Reference
  productId?: string
  productName?: string

  notes?: string
}

export interface VendorPerformance {
  vendorId: string
  vendorName: string

  // Metrics
  totalOrders: number
  totalValue: number

  // Delivery
  onTimeDeliveryRate: number
  avgDeliveryDelay: number // days

  // Quality
  qualityScore: number // 0-100
  defectRate: number
  returnRate: number

  // Responsiveness
  avgResponseTime: number // hours
  communicationScore: number

  // Payment
  avgPaymentDays: number
  discountsCaptured: number

  // Issues
  totalIssues: number
  resolvedIssues: number
  avgResolutionTime: number // days

  // Rating
  overallRating: number // 1-5

  // Trend
  performanceTrend: 'improving' | 'stable' | 'declining'

  lastEvaluationDate: string
}

export interface PurchaseAnalytics {
  // Spending
  totalSpend: number
  spendThisMonth: number
  spendThisQuarter: number
  spendThisYear: number
  spendGrowth: number

  // Orders
  totalOrders: number
  avgOrderValue: number
  ordersThisMonth: number

  // Vendors
  totalVendors: number
  topVendors: VendorSpend[]

  // Categories
  spendByCategory: CategorySpend[]

  // Savings
  totalSavings: number
  savingsRate: number

  // Efficiency
  avgProcessingTime: number // days
  avgApprovalTime: number // days
  onTimeDeliveryRate: number

  // Budget
  budgetUtilization: number
  budgetVariance: number

  // Trends
  spendByMonth: MonthlyMetric[]
  ordersByMonth: MonthlyMetric[]
}

export interface VendorSpend {
  vendorId: string
  vendorName: string
  totalSpend: number
  orderCount: number
  percentage: number
}

export interface CategorySpend {
  category: string
  totalSpend: number
  orderCount: number
  percentage: number
}

export interface MonthlyMetric {
  month: string
  value: number
}
