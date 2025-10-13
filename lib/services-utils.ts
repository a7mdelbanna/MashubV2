/**
 * MasHub V2 - Services Utility Functions
 *
 * Core utility functions for service management, pricing calculations,
 * subscription handling, and service delivery tracking
 */

import {
  Service,
  ServiceStatus,
  ServiceType,
  PricingModel,
  BillingCycle,
  ServiceSubscription,
  ServiceDelivery,
  DeliveryStatus,
  ServiceSLA,
  SLAStatus,
  ServiceAnalytics
} from '@/types/services'

// ==================== STATUS & TYPE FORMATTING ====================

/**
 * Get status badge color class for services
 */
export function getServiceStatusColor(status: ServiceStatus): string {
  const colors: Record<ServiceStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-400 text-white',
    discontinued: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get delivery status badge color
 */
export function getDeliveryStatusColor(status: DeliveryStatus): string {
  const colors: Record<DeliveryStatus, string> = {
    not_started: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    accepted: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get subscription status badge color
 */
export function getSubscriptionStatusColor(status: 'active' | 'paused' | 'cancelled' | 'expired'): string {
  const colors = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    expired: 'bg-gray-400 text-white'
  }
  return colors[status]
}

/**
 * Get SLA status badge color
 */
export function getSLAStatusColor(status: SLAStatus): string {
  const colors: Record<SLAStatus, string> = {
    active: 'bg-blue-100 text-blue-700',
    breached: 'bg-red-100 text-red-700',
    at_risk: 'bg-yellow-100 text-yellow-700',
    met: 'bg-green-100 text-green-700'
  }
  return colors[status]
}

/**
 * Format service type display text
 */
export function formatServiceType(type: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    one_time: 'One-Time',
    recurring: 'Recurring',
    subscription: 'Subscription',
    retainer: 'Retainer'
  }
  return labels[type]
}

/**
 * Format pricing model display text
 */
export function formatPricingModel(model: PricingModel): string {
  const labels: Record<PricingModel, string> = {
    fixed: 'Fixed Price',
    hourly: 'Hourly Rate',
    daily: 'Daily Rate',
    project_based: 'Project-Based',
    value_based: 'Value-Based',
    tiered: 'Tiered Pricing'
  }
  return labels[model]
}

/**
 * Format billing cycle display text
 */
export function formatBillingCycle(cycle: BillingCycle): string {
  const labels: Record<BillingCycle, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    semi_annual: 'Semi-Annual',
    annual: 'Annual',
    custom: 'Custom'
  }
  return labels[cycle]
}

// ==================== PRICING CALCULATIONS ====================

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
 * Calculate service price based on pricing model
 */
export function calculateServicePrice(
  service: Service,
  hours?: number,
  days?: number
): number {
  switch (service.pricingModel) {
    case 'fixed':
      return service.basePrice

    case 'hourly':
      if (!hours || !service.hourlyRate) return 0
      return service.hourlyRate * hours

    case 'daily':
      if (!days || !service.dailyRate) return 0
      return service.dailyRate * days

    case 'project_based':
      return service.basePrice

    case 'value_based':
      return service.basePrice

    case 'tiered':
      return service.basePrice

    default:
      return service.basePrice
  }
}

/**
 * Calculate subscription price with discounts
 */
export function calculateSubscriptionPrice(
  basePrice: number,
  billingCycle: BillingCycle
): { price: number, discount: number } {
  let multiplier = 1
  let discount = 0

  switch (billingCycle) {
    case 'monthly':
      multiplier = 1
      break
    case 'quarterly':
      multiplier = 3
      discount = 5 // 5% discount
      break
    case 'semi_annual':
      multiplier = 6
      discount = 10 // 10% discount
      break
    case 'annual':
      multiplier = 12
      discount = 15 // 15% discount
      break
    case 'custom':
      multiplier = 1
      break
  }

  const totalPrice = basePrice * multiplier
  const discountAmount = totalPrice * (discount / 100)
  const finalPrice = totalPrice - discountAmount

  return { price: finalPrice, discount: discountAmount }
}

/**
 * Calculate total service cost with add-ons
 */
export function calculateTotalWithAddons(
  service: Service,
  selectedAddons: string[]
): number {
  let total = service.basePrice

  service.addOns.forEach(addon => {
    if (selectedAddons.includes(addon.id)) {
      if (addon.pricingModel === 'fixed') {
        total += addon.price
      } else if (addon.pricingModel === 'percentage') {
        total += service.basePrice * (addon.price / 100)
      }
    }
  })

  return total
}

/**
 * Calculate service fees (setup + base + cancellation)
 */
export function calculateServiceFees(service: Service): {
  setupFee: number,
  basePrice: number,
  cancellationFee: number,
  total: number
} {
  const setupFee = service.setupFee || 0
  const basePrice = service.basePrice
  const cancellationFee = service.cancellationFee || 0

  return {
    setupFee,
    basePrice,
    cancellationFee,
    total: setupFee + basePrice
  }
}

// ==================== SUBSCRIPTION MANAGEMENT ====================

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(subscription: ServiceSubscription): boolean {
  return subscription.status === 'active'
}

/**
 * Check if subscription is in trial
 */
export function isInTrial(subscription: ServiceSubscription): boolean {
  return subscription.isTrialActive && !!subscription.trialEndsAt
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(subscription: ServiceSubscription): number {
  if (!subscription.trialEndsAt) return 0

  const now = new Date()
  const trialEnd = new Date(subscription.trialEndsAt)
  const diff = trialEnd.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Get days until next billing
 */
export function getDaysUntilNextBilling(nextBillingDate: string): number {
  const now = new Date()
  const nextBilling = new Date(nextBillingDate)
  const diff = nextBilling.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Calculate subscription duration in months
 */
export function getSubscriptionDurationMonths(startDate: string, endDate?: string): number {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const months = (end.getFullYear() - start.getFullYear()) * 12 +
                 (end.getMonth() - start.getMonth())

  return Math.max(0, months)
}

/**
 * Calculate next billing date based on cycle
 */
export function calculateNextBillingDate(
  currentDate: string,
  billingCycle: BillingCycle
): string {
  const date = new Date(currentDate)

  switch (billingCycle) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'quarterly':
      date.setMonth(date.getMonth() + 3)
      break
    case 'semi_annual':
      date.setMonth(date.getMonth() + 6)
      break
    case 'annual':
      date.setFullYear(date.getFullYear() + 1)
      break
    case 'custom':
      // Custom billing cycle handled separately
      break
  }

  return date.toISOString()
}

/**
 * Check if subscription renewal is approaching (within 30 days)
 */
export function isRenewalApproaching(subscription: ServiceSubscription): boolean {
  if (!subscription.endDate) return false

  const daysRemaining = getDaysUntilNextBilling(subscription.endDate)
  return daysRemaining > 0 && daysRemaining <= 30
}

// ==================== DELIVERY TRACKING ====================

/**
 * Calculate delivery progress percentage
 */
export function calculateDeliveryProgress(delivery: ServiceDelivery): number {
  return delivery.completionPercentage
}

/**
 * Check if delivery is on track
 */
export function isDeliveryOnTrack(delivery: ServiceDelivery): boolean {
  const now = new Date()
  const expected = new Date(delivery.expectedDeliveryDate)

  if (delivery.status === 'delivered' || delivery.status === 'accepted') {
    return true
  }

  if (now > expected && delivery.status !== 'delivered') {
    return false // Overdue
  }

  // Check if progress matches timeline
  const start = new Date(delivery.startDate)
  const totalDuration = expected.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  const expectedProgress = (elapsed / totalDuration) * 100

  return delivery.completionPercentage >= expectedProgress - 10 // 10% tolerance
}

/**
 * Get days remaining until delivery
 */
export function getDaysUntilDelivery(expectedDate: string): number {
  const now = new Date()
  const expected = new Date(expectedDate)
  const diff = expected.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if delivery is overdue
 */
export function isDeliveryOverdue(delivery: ServiceDelivery): boolean {
  if (delivery.status === 'delivered' || delivery.status === 'accepted') {
    return false
  }

  return new Date(delivery.expectedDeliveryDate) < new Date()
}

/**
 * Format time spent (hours) to readable format
 */
export function formatTimeSpent(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`
  } else if (hours < 8) {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  } else {
    const days = Math.floor(hours / 8)
    const remainingHours = Math.round(hours % 8)
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
  }
}

// ==================== SLA MANAGEMENT ====================

/**
 * Check SLA compliance
 */
export function checkSLACompliance(
  actualTime: number,
  slaTime: number
): SLAStatus {
  if (actualTime <= slaTime) {
    return 'met'
  } else if (actualTime <= slaTime * 1.1) {
    return 'at_risk' // Within 10% buffer
  } else {
    return 'breached'
  }
}

/**
 * Calculate SLA breach time (in minutes)
 */
export function calculateSLABreach(actualTime: number, slaTime: number): number {
  return Math.max(0, actualTime - slaTime)
}

/**
 * Format SLA time (minutes) to readable format
 */
export function formatSLATime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`
  } else if (minutes < 60 * 24) {
    const hours = Math.floor(minutes / 60)
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else {
    const days = Math.floor(minutes / (60 * 24))
    return `${days} day${days > 1 ? 's' : ''}`
  }
}

/**
 * Calculate uptime percentage
 */
export function calculateUptime(totalMinutes: number, downtimeMinutes: number): number {
  if (totalMinutes === 0) return 100
  return ((totalMinutes - downtimeMinutes) / totalMinutes) * 100
}

/**
 * Check if SLA uptime is met
 */
export function isSLAUptimeMet(actualUptime: number, slaUptime: number): boolean {
  return actualUptime >= slaUptime
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter services by status
 */
export function filterServicesByStatus(services: Service[], statuses: ServiceStatus[]): Service[] {
  return services.filter(s => statuses.includes(s.status))
}

/**
 * Get active services
 */
export function getActiveServices(services: Service[]): Service[] {
  return filterServicesByStatus(services, ['active'])
}

/**
 * Filter services by type
 */
export function filterServicesByType(services: Service[], types: ServiceType[]): Service[] {
  return services.filter(s => types.includes(s.type))
}

/**
 * Get subscription services
 */
export function getSubscriptionServices(services: Service[]): Service[] {
  return filterServicesByType(services, ['subscription', 'recurring'])
}

/**
 * Sort services by price (low to high)
 */
export function sortServicesByPrice(services: Service[], ascending: boolean = true): Service[] {
  return [...services].sort((a, b) => {
    const diff = a.basePrice - b.basePrice
    return ascending ? diff : -diff
  })
}

/**
 * Sort services by popularity (total sales)
 */
export function sortServicesByPopularity(services: Service[]): Service[] {
  return [...services].sort((a, b) => b.totalSales - a.totalSales)
}

/**
 * Sort services by rating (high to low)
 */
export function sortServicesByRating(services: Service[]): Service[] {
  return [...services].sort((a, b) => {
    const ratingA = a.averageRating || 0
    const ratingB = b.averageRating || 0
    return ratingB - ratingA
  })
}

// ==================== SEARCH ====================

/**
 * Search services by name, code, or keywords
 */
export function searchServices(services: Service[], query: string): Service[] {
  const lowercaseQuery = query.toLowerCase()

  return services.filter(service =>
    service.name.toLowerCase().includes(lowercaseQuery) ||
    service.code.toLowerCase().includes(lowercaseQuery) ||
    service.description.toLowerCase().includes(lowercaseQuery) ||
    service.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    service.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  )
}

// ==================== VALIDATION ====================

/**
 * Validate service code format (alphanumeric with hyphens)
 */
export function isValidServiceCode(code: string): boolean {
  const codeRegex = /^[A-Z0-9-]+$/i
  return codeRegex.test(code)
}

/**
 * Validate price is positive
 */
export function isValidPrice(price: number): boolean {
  return price >= 0
}

/**
 * Validate delivery date is in future
 */
export function isValidDeliveryDate(startDate: string, deliveryDate: string): boolean {
  return new Date(deliveryDate) > new Date(startDate)
}

// ==================== ANALYTICS ====================

/**
 * Calculate service profitability
 */
export function calculateServiceProfitability(
  revenue: number,
  cost: number
): { profit: number, margin: number } {
  const profit = revenue - cost
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0

  return { profit, margin }
}

/**
 * Calculate average delivery time (in days)
 */
export function calculateAvgDeliveryTime(service: Service): number {
  return service.estimatedDeliveryDays || 0
}

/**
 * Calculate churn rate for subscriptions
 */
export function calculateChurnRate(
  cancelledSubscriptions: number,
  totalSubscriptions: number
): number {
  if (totalSubscriptions === 0) return 0
  return (cancelledSubscriptions / totalSubscriptions) * 100
}

/**
 * Calculate monthly recurring revenue (MRR)
 */
export function calculateMRR(subscriptions: ServiceSubscription[]): number {
  return subscriptions
    .filter(s => s.status === 'active')
    .reduce((total, sub) => {
      let monthlyAmount = sub.amount

      // Convert to monthly if not already
      switch (sub.billingCycle) {
        case 'quarterly':
          monthlyAmount = sub.amount / 3
          break
        case 'semi_annual':
          monthlyAmount = sub.amount / 6
          break
        case 'annual':
          monthlyAmount = sub.amount / 12
          break
        case 'monthly':
        default:
          monthlyAmount = sub.amount
          break
      }

      return total + monthlyAmount
    }, 0)
}

/**
 * Calculate annual recurring revenue (ARR)
 */
export function calculateARR(subscriptions: ServiceSubscription[]): number {
  return calculateMRR(subscriptions) * 12
}

/**
 * Generate service analytics summary
 */
export function generateServiceAnalytics(
  services: Service[],
  subscriptions: ServiceSubscription[]
): ServiceAnalytics {
  const activeServices = getActiveServices(services)
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')

  const totalRevenue = services.reduce((sum, s) => sum + s.totalRevenue, 0)
  const totalSales = services.reduce((sum, s) => sum + s.totalSales, 0)

  return {
    serviceId: '', // Would be set for individual service analytics
    totalSales: totalSales,
    salesThisMonth: 0, // Would need monthly data
    revenue: totalRevenue,
    revenueThisMonth: 0, // Would need monthly data
    activeSubscriptions: activeSubscriptions.length,
    newSubscriptions: 0, // Would need time-based data
    churnedSubscriptions: subscriptions.filter(s => s.status === 'cancelled').length,
    churnRate: calculateChurnRate(
      subscriptions.filter(s => s.status === 'cancelled').length,
      subscriptions.length
    ),
    avgDeliveryTime: 0, // Would need delivery data
    onTimeDeliveryRate: 0, // Would need delivery data
    clientSatisfaction: 0, // Would need review data
    avgCost: 0, // Would need cost data
    avgProfit: 0, // Would need cost data
    profitMargin: 0, // Would need cost data
    salesByMonth: [],
    revenueByMonth: [],
    subscriptionsByMonth: []
  }
}

// ==================== PACKAGE & TIER MANAGEMENT ====================

/**
 * Check if service is a package
 */
export function isServicePackage(service: Service): boolean {
  return service.isPackage && !!service.packageItems && service.packageItems.length > 0
}

/**
 * Calculate package value
 */
export function calculatePackageValue(service: Service, allServices: Service[]): number {
  if (!service.packageItems) return service.basePrice

  return service.packageItems.reduce((total, item) => {
    const itemService = allServices.find(s => s.id === item.serviceId)
    if (!itemService) return total

    const itemPrice = itemService.basePrice * item.quantity
    const discount = item.discountPercentage || 0
    return total + (itemPrice * (1 - discount / 100))
  }, 0)
}

/**
 * Get popular tier
 */
export function getPopularTier(service: Service) {
  if (!service.pricingTiers) return null
  return service.pricingTiers.find(tier => tier.isPopular)
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate service code from name
 */
export function generateServiceCode(serviceName: string): string {
  const cleaned = serviceName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const timestamp = Date.now().toString().slice(-4)
  return `${cleaned.substring(0, 6)}-${timestamp}`
}

/**
 * Check if service requires consultation
 */
export function requiresConsultation(service: Service): boolean {
  return service.requiresConsultation
}

/**
 * Check if service requires quote
 */
export function requiresQuote(service: Service): boolean {
  return service.requiresQuote
}
