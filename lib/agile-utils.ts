/**
 * Agile System Utility Functions
 * Helper functions for calculations, formatting, and queries
 */

import {
  Task, Story, Epic, Sprint, Backlog,
  Priority, TaskStatus, WorkItemType,
  VelocityMetrics, VelocityData, Forecast,
  BurndownPoint, AcceptanceCriteria,
  WorkItemFilter
} from '@/types/agile'

// ============================================================================
// COLOR & STYLING UTILITIES
// ============================================================================

/**
 * Get color classes for priority level
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'critical':
      return 'text-red-400 bg-red-500/20 border-red-500/30'
    case 'urgent':
      return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
    case 'high':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    case 'medium':
      return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    case 'low':
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    default:
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
  }
}

/**
 * Get color classes for task status
 */
export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'backlog':
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    case 'todo':
      return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    case 'in_progress':
      return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
    case 'in_review':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    case 'done':
      return 'text-green-400 bg-green-500/20 border-green-500/30'
    case 'blocked':
      return 'text-red-400 bg-red-500/20 border-red-500/30'
    default:
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
  }
}

/**
 * Get icon name for work item type
 */
export function getWorkItemTypeIcon(type: WorkItemType): string {
  switch (type) {
    case 'task': return 'CheckSquare'
    case 'bug': return 'Bug'
    case 'feature': return 'Star'
    case 'improvement': return 'TrendingUp'
    case 'documentation': return 'FileText'
    case 'spike': return 'Zap'
    default: return 'Circle'
  }
}

// ============================================================================
// PROGRESS CALCULATIONS
// ============================================================================

/**
 * Calculate task completion percentage
 */
export function calculateTaskProgress(task: Task): number {
  if (task.status === 'done') return 100
  if (task.status === 'backlog' || task.status === 'todo') return 0
  if (task.status === 'in_progress') return 50
  if (task.status === 'in_review') return 80
  return 0
}

/**
 * Calculate story progress based on tasks
 */
export function calculateStoryProgress(story: Story): number {
  if (story.tasksTotal === 0) return 0
  return Math.round((story.tasksCompleted / story.tasksTotal) * 100)
}

/**
 * Calculate epic progress based on stories
 */
export function calculateEpicProgress(epic: Epic): number {
  if (epic.storiesTotal === 0) return 0
  return Math.round((epic.storiesCompleted / epic.storiesTotal) * 100)
}

/**
 * Calculate sprint progress based on story points
 */
export function calculateSprintProgress(sprint: Sprint): number {
  if (sprint.committedPoints === 0) return 0
  return Math.round((sprint.completedPoints / sprint.committedPoints) * 100)
}

/**
 * Calculate acceptance criteria completion
 */
export function calculateAcceptanceCriteriaProgress(criteria: AcceptanceCriteria[]): {
  total: number
  completed: number
  percentage: number
} {
  const total = criteria.length
  const completed = criteria.filter(c => c.completed).length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { total, completed, percentage }
}

// ============================================================================
// SPRINT & VELOCITY CALCULATIONS
// ============================================================================

/**
 * Calculate sprint velocity (points completed per day)
 */
export function calculateSprintVelocity(sprint: Sprint): number {
  const startDate = new Date(sprint.startDate)
  const endDate = new Date(sprint.endDate)
  const daysInSprint = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysInSprint === 0) return 0
  return Math.round((sprint.completedPoints / daysInSprint) * 100) / 100
}

/**
 * Calculate remaining days in sprint
 */
export function getSprintDaysRemaining(sprint: Sprint): number {
  const today = new Date()
  const endDate = new Date(sprint.endDate)
  const msRemaining = endDate.getTime() - today.getTime()
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

  return Math.max(0, daysRemaining)
}

/**
 * Calculate sprint burndown data
 */
export function calculateBurndown(
  sprint: Sprint,
  tasks: Task[]
): BurndownPoint[] {
  const startDate = new Date(sprint.startDate)
  const endDate = new Date(sprint.endDate)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const dailyIdealBurn = sprint.committedPoints / totalDays

  const burndownPoints: BurndownPoint[] = []

  for (let day = 0; day <= totalDays; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)

    // Calculate ideal remaining
    const idealRemaining = Math.max(0, sprint.committedPoints - (dailyIdealBurn * day))

    // Calculate actual remaining (tasks completed before this date)
    const completedByDate = tasks.filter(task => {
      if (!task.completedAt) return false
      return new Date(task.completedAt) <= date
    })
    const pointsCompleted = completedByDate.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
    const actualRemaining = Math.max(0, sprint.committedPoints - pointsCompleted)

    burndownPoints.push({
      date,
      idealRemaining,
      actualRemaining,
      completed: pointsCompleted
    })
  }

  return burndownPoints
}

/**
 * Calculate velocity metrics from sprint history
 */
export function calculateVelocityMetrics(sprints: Sprint[]): VelocityMetrics {
  const completedSprints = sprints.filter(s => s.status === 'completed')

  if (completedSprints.length === 0) {
    return {
      average: 0,
      median: 0,
      trend: 'stable',
      reliability: 0,
      historicalData: []
    }
  }

  const velocities = completedSprints.map(s => s.completedPoints)
  const average = velocities.reduce((a, b) => a + b, 0) / velocities.length

  // Calculate median
  const sorted = [...velocities].sort((a, b) => a - b)
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]

  // Calculate trend (simple linear regression)
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (velocities.length >= 3) {
    const recent = velocities.slice(-3)
    const older = velocities.slice(-6, -3)
    if (older.length > 0) {
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
      if (recentAvg > olderAvg * 1.1) trend = 'increasing'
      else if (recentAvg < olderAvg * 0.9) trend = 'decreasing'
    }
  }

  // Calculate reliability (coefficient of variation)
  const variance = velocities.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / velocities.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = average === 0 ? 0 : stdDev / average
  const reliability = Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 100)))

  // Build historical data
  const historicalData: VelocityData[] = completedSprints.map((sprint, index) => ({
    sprintId: sprint.id,
    sprintName: sprint.name,
    committed: sprint.committedPoints,
    completed: sprint.completedPoints,
    sprintNumber: index + 1,
    startDate: sprint.startDate,
    endDate: sprint.endDate
  }))

  return {
    average: Math.round(average * 10) / 10,
    median: Math.round(median * 10) / 10,
    trend,
    reliability: Math.round(reliability),
    historicalData
  }
}

/**
 * Forecast completion based on velocity
 */
export function forecastCompletion(
  remainingPoints: number,
  velocityMetrics: VelocityMetrics,
  sprintLengthDays: number = 14
): Forecast {
  if (velocityMetrics.average === 0) {
    return {
      remainingStoryPoints: remainingPoints,
      averageVelocity: 0,
      estimatedSprints: 0,
      estimatedCompletionDate: new Date(),
      confidence: 'low'
    }
  }

  const estimatedSprints = Math.ceil(remainingPoints / velocityMetrics.average)
  const daysToComplete = estimatedSprints * sprintLengthDays

  const completionDate = new Date()
  completionDate.setDate(completionDate.getDate() + daysToComplete)

  // Determine confidence based on reliability
  let confidence: 'low' | 'medium' | 'high' = 'medium'
  if (velocityMetrics.reliability >= 70) confidence = 'high'
  else if (velocityMetrics.reliability < 50) confidence = 'low'

  return {
    remainingStoryPoints: remainingPoints,
    averageVelocity: velocityMetrics.average,
    estimatedSprints,
    estimatedCompletionDate: completionDate,
    confidence
  }
}

// ============================================================================
// TIME FORMATTING
// ============================================================================

/**
 * Format minutes to human-readable time
 */
export function formatTimeEstimate(minutes: number): string {
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours < 8) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const days = Math.floor(hours / 8)
  const remainingHours = hours % 8

  if (remainingHours === 0) return `${days}d`
  return `${days}d ${remainingHours}h`
}

/**
 * Format date relative to today
 */
export function formatRelativeDate(date: Date): string {
  const today = new Date()
  const diffMs = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ============================================================================
// TASK QUERIES & FILTERING
// ============================================================================

/**
 * Filter tasks by criteria
 */
export function filterTasks(tasks: Task[], filter: WorkItemFilter): Task[] {
  return tasks.filter(task => {
    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      const matchesTitle = task.title.toLowerCase().includes(searchLower)
      const matchesDescription = task.description.toLowerCase().includes(searchLower)
      if (!matchesTitle && !matchesDescription) return false
    }

    // Priority filter
    if (filter.priority && filter.priority.length > 0) {
      if (!filter.priority.includes(task.priority)) return false
    }

    // Status filter
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(task.status)) return false
    }

    // Assignee filter
    if (filter.assignee && filter.assignee.length > 0) {
      if (!task.assigneeId || !filter.assignee.includes(task.assigneeId)) return false
    }

    // Type filter
    if (filter.type && filter.type.length > 0) {
      if (!filter.type.includes(task.type)) return false
    }

    // Checklist filter
    if (filter.hasChecklist !== undefined) {
      const hasChecklist = Boolean(task.checklistItemId)
      if (filter.hasChecklist !== hasChecklist) return false
    }

    // Blocked filter
    if (filter.isBlocked !== undefined) {
      const isBlocked = task.blockedBy.length > 0
      if (filter.isBlocked !== isBlocked) return false
    }

    // Overdue filter
    if (filter.isOverdue !== undefined && task.dueDate) {
      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'
      if (filter.isOverdue !== isOverdue) return false
    }

    // Date range filters
    if (filter.createdAfter && new Date(task.createdAt) < filter.createdAfter) return false
    if (filter.createdBefore && new Date(task.createdAt) > filter.createdBefore) return false

    return true
  })
}

/**
 * Sort tasks by priority
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Priority[] = ['critical', 'urgent', 'high', 'medium', 'low']

  return [...tasks].sort((a, b) => {
    const aPriority = priorityOrder.indexOf(a.priority)
    const bPriority = priorityOrder.indexOf(b.priority)
    return aPriority - bPriority
  })
}

/**
 * Get blocked tasks
 */
export function getBlockedTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => task.blockedBy.length > 0)
}

/**
 * Get overdue tasks
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = new Date()
  return tasks.filter(task => {
    if (!task.dueDate || task.status === 'done') return false
    return new Date(task.dueDate) < today
  })
}

/**
 * Get tasks by assignee
 */
export function getTasksByAssignee(tasks: Task[], assigneeId: string): Task[] {
  return tasks.filter(task => task.assigneeId === assigneeId)
}

/**
 * Check if task can be started (no blocking dependencies)
 */
export function canStartTask(task: Task, allTasks: Task[]): boolean {
  if (task.blockedBy.length === 0) return true

  // Check if all blocking tasks are done
  const blockingTasks = allTasks.filter(t => task.blockedBy.includes(t.id))
  return blockingTasks.every(t => t.status === 'done')
}

// ============================================================================
// CHECKLIST INTEGRATION
// ============================================================================

/**
 * Get checklist completion status for task
 */
export function getChecklistStatus(
  task: Task,
  checklistInstances: any[] // ChecklistInstance from types/index.ts
): {
  hasChecklist: boolean
  totalItems: number
  completedItems: number
  percentage: number
  isProductionReady: boolean
} | null {
  if (!task.checklistItemId || !task.checklistInstanceId) {
    return null
  }

  const instance = checklistInstances.find(i => i.id === task.checklistInstanceId)
  if (!instance) return null

  const item = instance.items.find((i: any) => i.id === task.checklistItemId)
  if (!item) return null

  return {
    hasChecklist: true,
    totalItems: instance.totalItems,
    completedItems: instance.completedItems,
    percentage: Math.round((instance.completedItems / instance.totalItems) * 100),
    isProductionReady: instance.isProductionReady
  }
}

// ============================================================================
// STORY POINT ESTIMATION
// ============================================================================

/**
 * Fibonacci sequence for story points
 */
export const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

/**
 * T-shirt sizes mapped to story points
 */
export const SIZE_TO_POINTS = {
  xs: 1,
  s: 3,
  m: 5,
  l: 8,
  xl: 13
}

/**
 * Story points to T-shirt size
 */
export function pointsToSize(points: number): 'xs' | 's' | 'm' | 'l' | 'xl' {
  if (points <= 1) return 'xs'
  if (points <= 3) return 's'
  if (points <= 5) return 'm'
  if (points <= 8) return 'l'
  return 'xl'
}

// ============================================================================
// BACKLOG MANAGEMENT
// ============================================================================

/**
 * Calculate backlog health
 */
export function calculateBacklogHealth(
  backlog: Backlog,
  averageVelocity: number
): 'healthy' | 'needs_grooming' | 'unhealthy' {
  const estimatedSprints = averageVelocity > 0 ? backlog.totalStoryPoints / averageVelocity : 0
  const readyPercentage = backlog.items.length > 0 ? (backlog.readyItemsCount / backlog.items.length) * 100 : 0

  // Healthy: 2-4 sprints worth of work, >60% ready
  if (estimatedSprints >= 2 && estimatedSprints <= 4 && readyPercentage > 60) {
    return 'healthy'
  }

  // Needs grooming: Some issues but manageable
  if (readyPercentage < 60 || estimatedSprints < 2 || estimatedSprints > 6) {
    return 'needs_grooming'
  }

  // Unhealthy: Too much or too little work, very few ready items
  return 'unhealthy'
}

/**
 * Get recommended backlog size (in story points)
 */
export function getRecommendedBacklogSize(averageVelocity: number, numberOfSprints: number = 3): number {
  return averageVelocity * numberOfSprints
}
