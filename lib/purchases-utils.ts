/**
 * MasHub V2 - Purchases Utility Functions
 *
 * Core utility functions for purchase order management, approval workflows,
 * receiving operations, and vendor performance tracking
 */

import {
  Purchase,
  PurchaseStatus,
  ApprovalStatus,
  ReceivingStatus,
  QualityStatus,
  PaymentStatus,
  ReceivingRecord,
  Discrepancy,
  VendorPerformance,
  PurchaseAnalytics
} from '@/types/purchases'

// ==================== STATUS FORMATTING ====================

/**
 * Get status badge color class for purchases
 */
export function getPurchaseStatusColor(status: PurchaseStatus): string {
  const colors: Record<PurchaseStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    ordered: 'bg-blue-100 text-blue-700',
    partial: 'bg-orange-100 text-orange-700',
    received: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get approval status badge color
 */
export function getApprovalStatusColor(status: ApprovalStatus): string {
  const colors: Record<ApprovalStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    escalated: 'bg-orange-100 text-orange-700'
  }
  return colors[status]
}

/**
 * Get receiving status badge color
 */
export function getReceivingStatusColor(status: ReceivingStatus): string {
  const colors: Record<ReceivingStatus, string> = {
    pending: 'bg-gray-100 text-gray-700',
    partial: 'bg-yellow-100 text-yellow-700',
    complete: 'bg-green-100 text-green-700',
    discrepancy: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get quality status badge color
 */
export function getQualityStatusColor(status: QualityStatus): string {
  const colors: Record<QualityStatus, string> = {
    pending: 'bg-gray-100 text-gray-700',
    passed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    conditional: 'bg-yellow-100 text-yellow-700'
  }
  return colors[status]
}

/**
 * Get payment status badge color
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    unpaid: 'bg-gray-100 text-gray-700',
    partial: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Format purchase status display text
 */
export function formatPurchaseStatus(status: PurchaseStatus): string {
  const labels: Record<PurchaseStatus, string> = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    ordered: 'Ordered',
    partial: 'Partially Received',
    received: 'Received',
    cancelled: 'Cancelled'
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
 * Calculate purchase total
 */
export function calculatePurchaseTotal(
  subtotal: number,
  tax: number,
  shipping: number,
  discount: number
): number {
  return subtotal + tax + shipping - discount
}

/**
 * Calculate remaining payment
 */
export function calculateRemainingPayment(total: number, paidAmount: number): number {
  return Math.max(0, total - paidAmount)
}

/**
 * Calculate payment progress percentage
 */
export function calculatePaymentProgress(paidAmount: number, total: number): number {
  if (total === 0) return 0
  return Math.round((paidAmount / total) * 100)
}

/**
 * Check if payment is overdue
 */
export function isPaymentOverdue(dueDate?: string): boolean {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

/**
 * Get days until payment due
 */
export function getDaysUntilDue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = due.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Get days overdue
 */
export function getDaysOverdue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = now.getTime() - due.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ==================== APPROVAL WORKFLOW ====================

/**
 * Check if purchase requires approval
 */
export function requiresApproval(purchase: Purchase): boolean {
  return purchase.approvalChain.length > 0
}

/**
 * Get current approval step
 */
export function getCurrentApprovalStep(purchase: Purchase) {
  return purchase.approvalChain.find(step => step.status === 'pending')
}

/**
 * Check if approval is complete
 */
export function isApprovalComplete(purchase: Purchase): boolean {
  return purchase.approvalChain.every(step =>
    step.status === 'approved' || step.decision === 'approved'
  )
}

/**
 * Check if purchase is rejected
 */
export function isApprovalRejected(purchase: Purchase): boolean {
  return purchase.approvalChain.some(step =>
    step.status === 'rejected' || step.decision === 'rejected'
  )
}

/**
 * Calculate approval progress
 */
export function calculateApprovalProgress(purchase: Purchase): number {
  const total = purchase.approvalChain.length
  if (total === 0) return 100

  const approved = purchase.approvalChain.filter(step =>
    step.status === 'approved' || step.decision === 'approved'
  ).length

  return Math.round((approved / total) * 100)
}

/**
 * Get pending approvers
 */
export function getPendingApprovers(purchase: Purchase): string[] {
  return purchase.approvalChain
    .filter(step => step.status === 'pending')
    .map(step => step.approverName)
}

// ==================== RECEIVING OPERATIONS ====================

/**
 * Calculate receiving progress
 */
export function calculateReceivingProgress(receivedQty: number, totalQty: number): number {
  if (totalQty === 0) return 0
  return Math.round((receivedQty / totalQty) * 100)
}

/**
 * Get receiving status based on quantities
 */
export function getReceivingStatus(receivedQty: number, totalQty: number, hasDiscrepancies: boolean): ReceivingStatus {
  if (hasDiscrepancies) return 'discrepancy'
  if (receivedQty === 0) return 'pending'
  if (receivedQty < totalQty) return 'partial'
  return 'complete'
}

/**
 * Check if receiving is complete
 */
export function isReceivingComplete(purchase: Purchase): boolean {
  return purchase.receivedQuantity >= purchase.totalQuantity
}

/**
 * Calculate pending quantity
 */
export function calculatePendingQuantity(totalQty: number, receivedQty: number): number {
  return Math.max(0, totalQty - receivedQty)
}

/**
 * Check if has discrepancies
 */
export function hasDiscrepancies(receivingRecord: ReceivingRecord): boolean {
  return receivingRecord.hasDiscrepancies || receivingRecord.discrepancies.length > 0
}

/**
 * Get unresolved discrepancies
 */
export function getUnresolvedDiscrepancies(discrepancies: Discrepancy[]): Discrepancy[] {
  return discrepancies.filter(d => !d.resolvedAt)
}

/**
 * Format discrepancy type
 */
export function formatDiscrepancyType(type: Discrepancy['type']): string {
  const labels = {
    quantity_short: 'Quantity Short',
    quantity_excess: 'Quantity Excess',
    wrong_item: 'Wrong Item',
    damaged: 'Damaged',
    quality_issue: 'Quality Issue'
  }
  return labels[type]
}

// ==================== QUALITY CONTROL ====================

/**
 * Calculate quality score percentage
 */
export function calculateQualityScore(acceptedQty: number, rejectedQty: number): number {
  const total = acceptedQty + rejectedQty
  if (total === 0) return 100
  return Math.round((acceptedQty / total) * 100)
}

/**
 * Check if quality check passed
 */
export function isQualityCheckPassed(status: QualityStatus): boolean {
  return status === 'passed' || status === 'conditional'
}

/**
 * Get rejection rate
 */
export function getRejectionRate(rejectedQty: number, totalQty: number): number {
  if (totalQty === 0) return 0
  return Math.round((rejectedQty / totalQty) * 100)
}

// ==================== BUDGET MANAGEMENT ====================

/**
 * Calculate budget utilization
 */
export function calculateBudgetUtilization(spent: number, allocated: number): number {
  if (allocated === 0) return 0
  return Math.round((spent / allocated) * 100)
}

/**
 * Calculate available budget
 */
export function calculateAvailableBudget(allocated: number, spent: number, committed: number): number {
  return Math.max(0, allocated - spent - committed)
}

/**
 * Check if over budget
 */
export function isOverBudget(spent: number, allocated: number): boolean {
  return spent > allocated
}

/**
 * Check if approaching budget limit (within 10%)
 */
export function isApproachingBudgetLimit(spent: number, committed: number, allocated: number): boolean {
  const total = spent + committed
  return total >= allocated * 0.9 && total < allocated
}

// ==================== VENDOR PERFORMANCE ====================

/**
 * Calculate overall vendor rating (0-5)
 */
export function calculateVendorRating(performance: VendorPerformance): number {
  const qualityScore = performance.qualityScore / 20 // Convert 0-100 to 0-5
  const deliveryScore = (performance.onTimeDeliveryRate / 100) * 5
  const commScore = performance.communicationScore / 20
  const responseScore = performance.avgResponseTime < 24 ? 5 : Math.max(0, 5 - (performance.avgResponseTime / 24))

  const avgScore = (qualityScore + deliveryScore + commScore + responseScore) / 4

  return Math.round(avgScore * 10) / 10 // Round to 1 decimal
}

/**
 * Get vendor performance trend indicator
 */
export function getVendorTrendIcon(trend: VendorPerformance['performanceTrend']): string {
  const icons = {
    improving: '📈',
    stable: '➡️',
    declining: '📉'
  }
  return icons[trend]
}

/**
 * Check if vendor is reliable (good performance)
 */
export function isReliableVendor(performance: VendorPerformance): boolean {
  return performance.overallRating >= 4.0 &&
         performance.onTimeDeliveryRate >= 90 &&
         performance.qualityScore >= 80
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter purchases by status
 */
export function filterPurchasesByStatus(purchases: Purchase[], statuses: PurchaseStatus[]): Purchase[] {
  return purchases.filter(p => statuses.includes(p.status))
}

/**
 * Get pending approval purchases
 */
export function getPendingApprovalPurchases(purchases: Purchase[]): Purchase[] {
  return filterPurchasesByStatus(purchases, ['pending_approval'])
}

/**
 * Get overdue purchases
 */
export function getOverduePurchases(purchases: Purchase[]): Purchase[] {
  return purchases.filter(p => p.dueDate && isPaymentOverdue(p.dueDate))
}

/**
 * Get purchases with discrepancies
 */
export function getPurchasesWithDiscrepancies(purchases: Purchase[]): Purchase[] {
  return purchases.filter(p => p.receivingStatus === 'discrepancy')
}

/**
 * Sort purchases by date (newest first)
 */
export function sortPurchasesByDate(purchases: Purchase[]): Purchase[] {
  return [...purchases].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * Sort purchases by amount (high to low)
 */
export function sortPurchasesByAmount(purchases: Purchase[]): Purchase[] {
  return [...purchases].sort((a, b) => b.total - a.total)
}

/**
 * Sort purchases by due date (earliest first)
 */
export function sortPurchasesByDueDate(purchases: Purchase[]): Purchase[] {
  return [...purchases].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}

// ==================== SEARCH ====================

/**
 * Search purchases by number, vendor, or description
 */
export function searchPurchases(purchases: Purchase[], query: string): Purchase[] {
  const lowercaseQuery = query.toLowerCase()

  return purchases.filter(purchase =>
    purchase.purchaseNumber.toLowerCase().includes(lowercaseQuery) ||
    purchase.vendorName.toLowerCase().includes(lowercaseQuery) ||
    purchase.notes?.toLowerCase().includes(lowercaseQuery) ||
    purchase.items.some(item => item.productName.toLowerCase().includes(lowercaseQuery))
  )
}

// ==================== VALIDATION ====================

/**
 * Validate purchase dates
 */
export function validatePurchaseDates(orderDate: string, expectedDelivery?: string): boolean {
  if (!expectedDelivery) return true
  return new Date(expectedDelivery) >= new Date(orderDate)
}

/**
 * Validate payment terms (must be positive)
 */
export function isValidPaymentTerms(days: number): boolean {
  return days > 0
}

/**
 * Validate received quantity
 */
export function isValidReceivedQuantity(received: number, ordered: number): boolean {
  return received >= 0 && received <= ordered * 1.1 // Allow 10% over-delivery
}

// ==================== ANALYTICS ====================

/**
 * Calculate average order value
 */
export function calculateAvgOrderValue(purchases: Purchase[]): number {
  if (purchases.length === 0) return 0
  const total = purchases.reduce((sum, p) => sum + p.total, 0)
  return total / purchases.length
}

/**
 * Calculate on-time delivery rate
 */
export function calculateOnTimeDeliveryRate(
  onTimeDeliveries: number,
  totalDeliveries: number
): number {
  if (totalDeliveries === 0) return 0
  return Math.round((onTimeDeliveries / totalDeliveries) * 100)
}

/**
 * Calculate average processing time (days)
 */
export function calculateAvgProcessingTime(purchases: Purchase[]): number {
  const completed = purchases.filter(p => p.orderedAt && p.receivedAt)
  if (completed.length === 0) return 0

  const totalDays = completed.reduce((sum, p) => {
    const ordered = new Date(p.orderedAt!).getTime()
    const received = new Date(p.receivedAt!).getTime()
    const days = (received - ordered) / (1000 * 60 * 60 * 24)
    return sum + days
  }, 0)

  return Math.round(totalDays / completed.length)
}

/**
 * Calculate cost savings from discounts
 */
export function calculateTotalSavings(purchases: Purchase[]): number {
  return purchases.reduce((sum, p) => sum + p.discount, 0)
}

/**
 * Generate purchase analytics summary
 */
export function generatePurchaseAnalytics(purchases: Purchase[]): PurchaseAnalytics {
  const totalSpend = purchases.reduce((sum, p) => sum + p.total, 0)
  const currentMonth = purchases.filter(p => {
    const created = new Date(p.createdAt)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  })

  // Group by vendor
  const vendorSpend = purchases.reduce((acc, p) => {
    const existing = acc.find(v => v.vendorId === p.vendorId)
    if (existing) {
      existing.totalSpend += p.total
      existing.orderCount++
    } else {
      acc.push({
        vendorId: p.vendorId,
        vendorName: p.vendorName,
        totalSpend: p.total,
        orderCount: 1,
        percentage: 0
      })
    }
    return acc
  }, [] as any[])

  // Calculate percentages
  vendorSpend.forEach(v => {
    v.percentage = totalSpend > 0 ? Math.round((v.totalSpend / totalSpend) * 100) : 0
  })

  return {
    totalSpend: totalSpend,
    spendThisMonth: currentMonth.reduce((sum, p) => sum + p.total, 0),
    spendThisQuarter: 0, // Would need quarter calculation
    spendThisYear: 0, // Would need year calculation
    spendGrowth: 0, // Would need historical data
    totalOrders: purchases.length,
    avgOrderValue: calculateAvgOrderValue(purchases),
    ordersThisMonth: currentMonth.length,
    totalVendors: new Set(purchases.map(p => p.vendorId)).size,
    topVendors: vendorSpend.sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5),
    spendByCategory: [],
    totalSavings: calculateTotalSavings(purchases),
    savingsRate: totalSpend > 0 ? Math.round((calculateTotalSavings(purchases) / totalSpend) * 100) : 0,
    avgProcessingTime: calculateAvgProcessingTime(purchases),
    avgApprovalTime: 0, // Would need approval timing data
    onTimeDeliveryRate: 0, // Would need delivery timing data
    budgetUtilization: 0, // Would need budget data
    budgetVariance: 0, // Would need budget data
    spendByMonth: [],
    ordersByMonth: []
  }
}

// ==================== REPORTING ====================

/**
 * Get purchase summary for reporting
 */
export function getPurchaseSummary(purchase: Purchase): {
  number: string,
  vendor: string,
  total: number,
  status: string,
  daysToDeliver?: number
} {
  return {
    number: purchase.purchaseNumber,
    vendor: purchase.vendorName,
    total: purchase.total,
    status: formatPurchaseStatus(purchase.status),
    daysToDeliver: purchase.expectedDeliveryDate ?
      getDaysUntilDue(purchase.expectedDeliveryDate) : undefined
  }
}

/**
 * Format purchase number with prefix
 */
export function formatPurchaseNumber(id: number, prefix: string = 'PO'): string {
  return `${prefix}-${id.toString().padStart(6, '0')}`
}

/**
 * Generate receiving number
 */
export function generateReceivingNumber(purchaseNumber: string, sequence: number): string {
  return `RCV-${purchaseNumber}-${sequence.toString().padStart(2, '0')}`
}
