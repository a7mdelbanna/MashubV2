/**
 * MasHub V2 - Visits Utility Functions
 *
 * Core utility functions for field visit management, GPS tracking,
 * route optimization, and visit analytics
 */

import {
  Visit,
  VisitStatus,
  VisitType,
  VisitPriority,
  CheckInMethod,
  TransportMode,
  VisitRoute,
  GeoLocation,
  VisitAnalytics
} from '@/types/visits'

// ==================== STATUS & TYPE FORMATTING ====================

/**
 * Get status badge color class for visits
 */
export function getVisitStatusColor(status: VisitStatus): string {
  const colors: Record<VisitStatus, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-400 text-white'
  }
  return colors[status]
}

/**
 * Get priority badge color
 */
export function getVisitPriorityColor(priority: VisitPriority): string {
  const colors: Record<VisitPriority, string> = {
    low: 'bg-gray-100 text-gray-600',
    normal: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  }
  return colors[priority]
}

/**
 * Format visit status display text
 */
export function formatVisitStatus(status: VisitStatus): string {
  const labels: Record<VisitStatus, string> = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show'
  }
  return labels[status]
}

/**
 * Format visit type display text
 */
export function formatVisitType(type: VisitType): string {
  const labels: Record<VisitType, string> = {
    sales: 'Sales',
    support: 'Support',
    delivery: 'Delivery',
    inspection: 'Inspection',
    training: 'Training',
    consultation: 'Consultation',
    followup: 'Follow-up',
    other: 'Other'
  }
  return labels[type]
}

/**
 * Get transport mode icon
 */
export function getTransportModeIcon(mode: TransportMode): string {
  const icons: Record<TransportMode, string> = {
    car: '🚗',
    public_transport: '🚌',
    walking: '🚶',
    bike: '🚲',
    company_vehicle: '🚐',
    other: '🚕'
  }
  return icons[mode]
}

/**
 * Get check-in method icon
 */
export function getCheckInMethodIcon(method: CheckInMethod): string {
  const icons: Record<CheckInMethod, string> = {
    manual: '✍️',
    gps: '📍',
    qr_code: '📱',
    nfc: '📲'
  }
  return icons[method]
}

// ==================== DATE & TIME ====================

/**
 * Format visit date and time
 */
export function formatVisitDateTime(date: string, time: string): string {
  const d = new Date(date)
  return `${d.toLocaleDateString()} at ${time}`
}

/**
 * Get hours until visit
 */
export function getHoursUntilVisit(scheduledDate: string, scheduledTime: string): number {
  const now = new Date()
  const visitDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
  const diff = visitDateTime.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60))
}

/**
 * Check if visit is today
 */
export function isVisitToday(scheduledDate: string): boolean {
  const today = new Date()
  const visit = new Date(scheduledDate)

  return today.getDate() === visit.getDate() &&
         today.getMonth() === visit.getMonth() &&
         today.getFullYear() === visit.getFullYear()
}

/**
 * Check if visit is upcoming (within next 7 days)
 */
export function isUpcomingVisit(scheduledDate: string): boolean {
  const now = new Date()
  const visit = new Date(scheduledDate)
  const diffDays = Math.ceil((visit.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return diffDays >= 0 && diffDays <= 7
}

/**
 * Check if visit is overdue
 */
export function isVisitOverdue(scheduledDate: string, scheduledTime: string, status: VisitStatus): boolean {
  if (status === 'completed' || status === 'cancelled') return false

  const now = new Date()
  const visitDateTime = new Date(`${scheduledDate}T${scheduledTime}`)

  return now > visitDateTime
}

/**
 * Calculate visit duration in minutes
 */
export function calculateVisitDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diff = end.getTime() - start.getTime()
  return Math.round(diff / (1000 * 60))
}

/**
 * Format duration (minutes) to human readable
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  }

// ==================== GPS & LOCATION ====================

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  } else {
    return `${km.toFixed(1)}km`
  }
}

/**
 * Check if check-in location is within acceptable range (100m)
 */
export function isCheckInLocationValid(
  checkInLat: number,
  checkInLon: number,
  expectedLat: number,
  expectedLon: number
): boolean {
  const distance = calculateDistance(checkInLat, checkInLon, expectedLat, expectedLon)
  return distance <= 0.1 // 100 meters
}

/**
 * Get location accuracy status
 */
export function getLocationAccuracyStatus(accuracy?: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (!accuracy) return 'poor'
  if (accuracy <= 10) return 'excellent'
  if (accuracy <= 50) return 'good'
  if (accuracy <= 100) return 'fair'
  return 'poor'
}

// ==================== CHECK-IN/CHECK-OUT ====================

/**
 * Check if visit is checked in
 */
export function isCheckedIn(visit: Visit): boolean {
  return !!visit.checkInTime
}

/**
 * Check if visit is checked out
 */
export function isCheckedOut(visit: Visit): boolean {
  return !!visit.checkOutTime
}

/**
 * Calculate time on site (minutes)
 */
export function calculateTimeOnSite(checkInTime?: string, checkOutTime?: string): number {
  if (!checkInTime) return 0
  const checkOut = checkOutTime ? new Date(checkOutTime) : new Date()
  const checkIn = new Date(checkInTime)
  return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60))
}

/**
 * Check if check-in is late (more than 15 minutes after scheduled start)
 */
export function isCheckInLate(checkInTime: string, scheduledStart: string): boolean {
  const checkIn = new Date(checkInTime)
  const scheduled = new Date(scheduledStart)
  const diffMinutes = (checkIn.getTime() - scheduled.getTime()) / (1000 * 60)
  return diffMinutes > 15
}

// ==================== ROUTE OPTIMIZATION ====================

/**
 * Calculate total route distance
 */
export function calculateRouteDistance(visits: Visit[]): number {
  let totalDistance = 0

  for (let i = 0; i < visits.length - 1; i++) {
    const current = visits[i]
    const next = visits[i + 1]

    if (current.address.latitude && current.address.longitude &&
        next.address.latitude && next.address.longitude) {
      const distance = calculateDistance(
        current.address.latitude,
        current.address.longitude,
        next.address.latitude,
        next.address.longitude
      )
      totalDistance += distance
    }
  }

  return totalDistance
}

/**
 * Estimate travel time based on distance and mode
 */
export function estimateTravelTime(distanceKm: number, mode: TransportMode): number {
  // Average speeds in km/h
  const speeds: Record<TransportMode, number> = {
    car: 50,
    company_vehicle: 50,
    public_transport: 30,
    bike: 15,
    walking: 5,
    other: 40
  }

  const speed = speeds[mode]
  const hours = distanceKm / speed
  return Math.ceil(hours * 60) // Convert to minutes
}

/**
 * Calculate estimated route duration (travel + visit time)
 */
export function calculateRouteDuration(
  route: VisitRoute,
  visits: Visit[]
): number {
  const travelTime = route.totalDistance * 60 / 50 // Assume 50 km/h average
  const visitTime = visits.reduce((sum, visit) => sum + visit.estimatedDuration, 0)
  return Math.ceil(travelTime + visitTime)
}

/**
 * Check if route is optimized
 */
export function isRouteOptimized(route: VisitRoute): boolean {
  return route.isOptimized
}

// ==================== TASKS & COMPLETION ====================

/**
 * Calculate task completion percentage
 */
export function calculateTaskCompletion(visit: Visit): number {
  const total = visit.tasks.length
  if (total === 0) return 100

  const completed = visit.tasks.filter(t => t.isCompleted).length
  return Math.round((completed / total) * 100)
}

/**
 * Check if all tasks completed
 */
export function areAllTasksCompleted(visit: Visit): boolean {
  return visit.tasks.every(t => t.isCompleted)
}

/**
 * Get pending tasks
 */
export function getPendingTasks(visit: Visit) {
  return visit.tasks.filter(t => !t.isCompleted)
}

/**
 * Check if checklist is completed
 */
export function isChecklistCompleted(visit: Visit): boolean {
  return visit.checklistCompleted
}

// ==================== EXPENSES ====================

/**
 * Calculate total visit expenses
 */
export function calculateTotalExpenses(visit: Visit): number {
  return visit.expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

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
 * Get approved expenses
 */
export function getApprovedExpenses(visit: Visit) {
  return visit.expenses.filter(e => e.isApproved)
}

/**
 * Calculate total approved expenses
 */
export function calculateApprovedExpenses(visit: Visit): number {
  return getApprovedExpenses(visit).reduce((sum, e) => sum + e.amount, 0)
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter visits by status
 */
export function filterVisitsByStatus(visits: Visit[], statuses: VisitStatus[]): Visit[] {
  return visits.filter(v => statuses.includes(v.status))
}

/**
 * Get today's visits
 */
export function getTodaysVisits(visits: Visit[]): Visit[] {
  return visits.filter(v => isVisitToday(v.scheduledDate))
}

/**
 * Get upcoming visits
 */
export function getUpcomingVisits(visits: Visit[]): Visit[] {
  return visits.filter(v => isUpcomingVisit(v.scheduledDate))
}

/**
 * Get completed visits
 */
export function getCompletedVisits(visits: Visit[]): Visit[] {
  return filterVisitsByStatus(visits, ['completed'])
}

/**
 * Get visits by assignee
 */
export function getVisitsByAssignee(visits: Visit[], userId: string): Visit[] {
  return visits.filter(v => v.assignedToUserId === userId)
}

/**
 * Sort visits by date (earliest first)
 */
export function sortVisitsByDate(visits: Visit[]): Visit[] {
  return [...visits].sort((a, b) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledStartTime}`)
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledStartTime}`)
    return dateA.getTime() - dateB.getTime()
  })
}

/**
 * Sort visits by priority (highest first)
 */
export function sortVisitsByPriority(visits: Visit[]): Visit[] {
  const priorityOrder: Record<VisitPriority, number> = {
    urgent: 0,
    high: 1,
    normal: 2,
    low: 3
  }

  return [...visits].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// ==================== SEARCH ====================

/**
 * Search visits by number, title, client, or location
 */
export function searchVisits(visits: Visit[], query: string): Visit[] {
  const lowercaseQuery = query.toLowerCase()

  return visits.filter(visit =>
    visit.visitNumber.toLowerCase().includes(lowercaseQuery) ||
    visit.title.toLowerCase().includes(lowercaseQuery) ||
    visit.clientName?.toLowerCase().includes(lowercaseQuery) ||
    visit.locationName?.toLowerCase().includes(lowercaseQuery) ||
    visit.address.formatted?.toLowerCase().includes(lowercaseQuery)
  )
}

// ==================== VALIDATION ====================

/**
 * Validate visit times
 */
export function validateVisitTimes(startTime: string, endTime: string): boolean {
  return startTime < endTime
}

/**
 * Validate scheduled date is in future
 */
export function isValidScheduledDate(date: string): boolean {
  return new Date(date) >= new Date()
}

// ==================== ANALYTICS ====================

/**
 * Calculate visit completion rate
 */
export function calculateCompletionRate(visits: Visit[]): number {
  if (visits.length === 0) return 0
  const completed = getCompletedVisits(visits).length
  return Math.round((completed / visits.length) * 100)
}

/**
 * Calculate on-time completion rate
 */
export function calculateOnTimeRate(visits: Visit[]): number {
  const completed = getCompletedVisits(visits)
  if (completed.length === 0) return 0

  const onTime = completed.filter(visit => {
    if (!visit.actualEndTime) return false
    const scheduled = new Date(`${visit.scheduledDate}T${visit.scheduledEndTime}`)
    const actual = new Date(visit.actualEndTime)
    return actual <= scheduled
  }).length

  return Math.round((onTime / completed.length) * 100)
}

/**
 * Calculate average visit duration
 */
export function calculateAvgVisitDuration(visits: Visit[]): number {
  const completed = visits.filter(v => v.actualDuration)
  if (completed.length === 0) return 0

  const total = completed.reduce((sum, v) => sum + (v.actualDuration || 0), 0)
  return Math.round(total / completed.length)
}

/**
 * Calculate average satisfaction rating
 */
export function calculateAvgSatisfaction(visits: Visit[]): number {
  const rated = visits.filter(v => v.satisfactionRating)
  if (rated.length === 0) return 0

  const total = rated.reduce((sum, v) => sum + (v.satisfactionRating || 0), 0)
  return Math.round((total / rated.length) * 10) / 10 // Round to 1 decimal
}

/**
 * Calculate no-show rate
 */
export function calculateNoShowRate(visits: Visit[]): number {
  if (visits.length === 0) return 0
  const noShows = filterVisitsByStatus(visits, ['no_show']).length
  return Math.round((noShows / visits.length) * 100)
}

/**
 * Generate visit analytics summary
 */
export function generateVisitAnalytics(visits: Visit[]): VisitAnalytics {
  const completed = getCompletedVisits(visits)
  const cancelled = filterVisitsByStatus(visits, ['cancelled'])

  const currentMonth = visits.filter(v => {
    const scheduled = new Date(v.scheduledDate)
    const now = new Date()
    return scheduled.getMonth() === now.getMonth() && scheduled.getFullYear() === now.getFullYear()
  })

  return {
    totalVisits: visits.length,
    visitsThisMonth: currentMonth.length,
    completedVisits: completed.length,
    cancelledVisits: cancelled.length,
    completionRate: calculateCompletionRate(visits),
    avgCompletionTime: calculateAvgVisitDuration(visits),
    onTimeRate: calculateOnTimeRate(visits),
    avgTravelTime: 0, // Would need travel time data
    avgDistancePerVisit: 0, // Would need distance data
    visitsPerDay: 0, // Would need daily data
    avgSatisfactionRating: calculateAvgSatisfaction(visits),
    repeatVisitRate: 0, // Would need historical data
    totalRevenue: visits.reduce((sum, v) => sum + (v.actualRevenue || 0), 0),
    avgRevenuePerVisit: 0, // Would calculate from revenue
    totalExpenses: visits.reduce((sum, v) => sum + calculateTotalExpenses(v), 0),
    noShowRate: calculateNoShowRate(visits),
    rescheduleRate: 0, // Would need reschedule tracking
    visitsByMonth: [],
    completionRateByMonth: [],
    satisfactionByMonth: [],
    visitsByType: [],
    visitsByUser: []
  }
}

// ==================== RECURRENCE ====================

/**
 * Check if visit is recurring
 */
export function isRecurringVisit(visit: Visit): boolean {
  return visit.isRecurring && !!visit.recurrencePattern
}

/**
 * Format recurrence pattern
 */
export function formatRecurrencePattern(visit: Visit): string {
  if (!visit.recurrencePattern) return 'One-time'

  const pattern = visit.recurrencePattern
  switch (pattern.frequency) {
    case 'daily':
      return pattern.interval === 1 ? 'Daily' : `Every ${pattern.interval} days`
    case 'weekly':
      return pattern.interval === 1 ? 'Weekly' : `Every ${pattern.interval} weeks`
    case 'bi_weekly':
      return 'Bi-weekly'
    case 'monthly':
      return pattern.interval === 1 ? 'Monthly' : `Every ${pattern.interval} months`
    case 'quarterly':
      return 'Quarterly'
    case 'custom':
      return 'Custom schedule'
    default:
      return 'One-time'
  }
}

// ==================== WEATHER ====================

/**
 * Format temperature
 */
export function formatTemperature(temp: number, unit: 'C' | 'F'): string {
  return `${temp}°${unit}`
}

/**
 * Get weather icon/emoji
 */
export function getWeatherIcon(condition: string): string {
  const lower = condition.toLowerCase()
  if (lower.includes('sun') || lower.includes('clear')) return '☀️'
  if (lower.includes('cloud')) return '☁️'
  if (lower.includes('rain')) return '🌧️'
  if (lower.includes('storm')) return '⛈️'
  if (lower.includes('snow')) return '❄️'
  if (lower.includes('fog')) return '🌫️'
  return '🌤️'
}
