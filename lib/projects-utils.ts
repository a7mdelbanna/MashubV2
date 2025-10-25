/**
 * MasHub V2 - Projects Utility Functions
 *
 * Core utility functions for project management, task tracking,
 * sprint calculations, and project analytics
 */

import { Project } from '@/types'
import {
  ProjectStatus,
  ProjectPriority,
  Task,
  TaskStatus,
  TaskPriority,
  Sprint,
  SprintStatus,
  Milestone,
  BurndownPoint,
  ProjectAnalytics
} from '@/types/projects'

// ==================== STATUS & PRIORITY FORMATTING ====================

/**
 * Get status badge color class for projects
 */
export function getProjectStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    planning: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-green-100 text-green-700',
    on_hold: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
    archived: 'bg-gray-100 text-gray-500'
  }
  return colors[status]
}

/**
 * Get status badge color class for tasks
 */
export function getTaskStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    backlog: 'bg-gray-100 text-gray-700',
    todo: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    in_review: 'bg-orange-100 text-orange-700',
    done: 'bg-green-100 text-green-700',
    blocked: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Get priority badge color class
 */
export function getPriorityColor(priority: TaskPriority | ProjectPriority): string {
  const colors: Record<TaskPriority, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
    critical: 'bg-red-500 text-white'
  }
  return colors[priority]
}

/**
 * Format project status display text
 */
export function formatProjectStatus(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    draft: 'Draft',
    planning: 'Planning',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
    archived: 'Archived'
  }
  return labels[status]
}

// ==================== COMPLETION & PROGRESS ====================

/**
 * Calculate project completion percentage
 */
export function calculateProjectCompletion(
  tasksCompleted: number,
  tasksTotal: number
): number {
  if (tasksTotal === 0) return 0
  return Math.round((tasksCompleted / tasksTotal) * 100)
}

/**
 * Calculate sprint velocity (story points completed per sprint)
 */
export function calculateSprintVelocity(sprint: Sprint): number {
  return sprint.velocity || 0
}

/**
 * Calculate milestone progress
 */
export function calculateMilestoneProgress(milestone: Milestone): number {
  if (milestone.totalTasks === 0) return 0
  return Math.round((milestone.completedTasks / milestone.totalTasks) * 100)
}

/**
 * Check if project is on track based on completion and timeline
 */
export function isProjectOnTrack(project: Project): boolean {
  if (!project.startDate || !project.endDate) return true

  const now = new Date()
  const start = new Date(project.startDate)
  const end = new Date(project.endDate)

  if (now < start || now > end) return false

  const totalDuration = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  const expectedProgress = (elapsed / totalDuration) * 100

  return project.completionPercentage >= expectedProgress - 10 // 10% tolerance
}

/**
 * Calculate burndown rate for sprint
 */
export function calculateBurndownRate(burndownData: BurndownPoint[]): number {
  if (burndownData.length < 2) return 0

  const first = burndownData[0]
  const last = burndownData[burndownData.length - 1]

  const days = burndownData.length
  const pointsCompleted = first.remaining - last.remaining

  return pointsCompleted / days
}

// ==================== DATE & TIME CALCULATIONS ====================

/**
 * Calculate days remaining until deadline
 */
export function getDaysRemaining(deadline: string): number {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if deadline is overdue
 */
export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date()
}

/**
 * Calculate project duration in days
 */
export function getProjectDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end.getTime() - start.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Format time estimate (minutes) to human readable
 */
export function formatTimeEstimate(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  } else if (minutes < 60 * 24) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  } else {
    const days = Math.floor(minutes / (60 * 24))
    const hours = Math.floor((minutes % (60 * 24)) / 60)
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  }
}

// ==================== TASK MANAGEMENT ====================

/**
 * Get tasks by status
 */
export function getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter(task => task.status === status)
}

/**
 * Get tasks by assignee
 */
export function getTasksByAssignee(tasks: Task[], assigneeId: string): Task[] {
  return tasks.filter(task => task.assigneeId === assigneeId)
}

/**
 * Get blocked tasks
 */
export function getBlockedTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => task.status === 'blocked' || task.blockedBy.length > 0)
}

/**
 * Calculate total story points for tasks
 */
export function calculateTotalStoryPoints(tasks: Task[]): number {
  return tasks.reduce((total, task) => total + (task.storyPoints || 0), 0)
}

/**
 * Sort tasks by priority
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    critical: 0,
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4
  }

  return [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Check if task can be started (no blocking dependencies)
 */
export function canStartTask(task: Task, allTasks: Task[]): boolean {
  if (task.blockedBy.length === 0) return true

  return task.blockedBy.every(blockerId => {
    const blocker = allTasks.find(t => t.id === blockerId)
    return blocker?.status === 'done'
  })
}

// ==================== SPRINT MANAGEMENT ====================

/**
 * Check if sprint is active
 */
export function isSprintActive(sprint: Sprint): boolean {
  return sprint.status === 'active'
}

/**
 * Get sprint progress percentage
 */
export function getSprintProgress(sprint: Sprint): number {
  if (sprint.totalStoryPoints === 0) return 0
  return Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100)
}

/**
 * Get sprint days remaining
 */
export function getSprintDaysRemaining(sprint: Sprint): number {
  const now = new Date()
  const end = new Date(sprint.endDate)
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Calculate sprint capacity (total story points)
 */
export function calculateSprintCapacity(sprint: Sprint): number {
  return sprint.totalStoryPoints
}

/**
 * Generate ideal burndown line
 */
export function generateIdealBurndown(
  totalPoints: number,
  sprintDays: number
): BurndownPoint[] {
  const pointsPerDay = totalPoints / sprintDays
  const burndown: BurndownPoint[] = []

  for (let day = 0; day <= sprintDays; day++) {
    burndown.push({
      date: '', // Would be filled with actual dates
      remaining: Math.max(0, totalPoints - (pointsPerDay * day)),
      completed: Math.min(totalPoints, pointsPerDay * day),
      ideal: Math.max(0, totalPoints - (pointsPerDay * day))
    })
  }

  return burndown
}

// ==================== BUDGET & FINANCIAL ====================

/**
 * Calculate budget utilization percentage
 */
export function calculateBudgetUtilization(spent: number, budget: number): number {
  if (budget === 0) return 0
  return Math.round((spent / budget) * 100)
}

/**
 * Calculate remaining budget
 */
export function getRemainingBudget(budget: number, spent: number): number {
  return Math.max(0, budget - spent)
}

/**
 * Check if project is over budget
 */
export function isOverBudget(spent: number, budget: number): boolean {
  return spent > budget
}

/**
 * Format budget amount with currency
 */
export function formatBudget(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// ==================== TEAM & COLLABORATION ====================

/**
 * Get team member workload (number of assigned tasks)
 */
export function getTeamMemberWorkload(tasks: Task[], userId: string): number {
  return tasks.filter(task =>
    task.assigneeId === userId &&
    task.status !== 'done' &&
    task.status !== 'backlog'
  ).length
}

/**
 * Calculate team velocity (average story points per sprint)
 */
export function calculateTeamVelocity(sprints: Sprint[]): number {
  if (sprints.length === 0) return 0

  const completedSprints = sprints.filter(s => s.status === 'completed')
  if (completedSprints.length === 0) return 0

  const totalVelocity = completedSprints.reduce((sum, sprint) => sum + sprint.velocity, 0)
  return Math.round(totalVelocity / completedSprints.length)
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter projects by status
 */
export function filterProjectsByStatus(projects: Project[], statuses: ProjectStatus[]): Project[] {
  return projects.filter(p => statuses.includes(p.status))
}

/**
 * Filter active projects
 */
export function getActiveProjects(projects: Project[]): Project[] {
  return filterProjectsByStatus(projects, ['planning', 'in_progress'])
}

/**
 * Sort projects by deadline (nearest first)
 */
export function sortProjectsByDeadline(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (!a.endDate) return 1
    if (!b.endDate) return -1
    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  })
}

/**
 * Sort projects by priority
 */
export function sortProjectsByPriority(projects: Project[]): Project[] {
  const priorityOrder: Record<ProjectPriority, number> = {
    critical: 0,
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4
  }

  return [...projects].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// ==================== VALIDATION ====================

/**
 * Validate project dates
 */
export function validateProjectDates(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return end > start
}

/**
 * Validate sprint dates within project timeline
 */
export function validateSprintDates(
  sprintStart: string,
  sprintEnd: string,
  projectStart: string,
  projectEnd: string
): boolean {
  const sStart = new Date(sprintStart)
  const sEnd = new Date(sprintEnd)
  const pStart = new Date(projectStart)
  const pEnd = new Date(projectEnd)

  return sStart >= pStart && sEnd <= pEnd && sEnd > sStart
}

// ==================== ANALYTICS ====================

/**
 * Calculate project health score (0-100)
 */
export function calculateProjectHealth(project: Project): number {
  let score = 100

  // Deduct points for delays
  if (project.endDate && isOverdue(project.endDate) && project.status !== 'completed') {
    score -= 30
  }

  // Deduct points for low completion vs expected
  if (!isProjectOnTrack(project)) {
    score -= 20
  }

  // Deduct points for over budget
  if (project.budget && project.spentAmount > project.budget) {
    score -= 25
  }

  // Deduct points for blocked tasks
  if (project.tasksTotal > 0) {
    const blockageRate = (project.tasksTotal - project.tasksCompleted) / project.tasksTotal
    if (blockageRate > 0.3) score -= 15
  }

  return Math.max(0, score)
}

/**
 * Get project health status
 */
export function getProjectHealthStatus(health: number): 'excellent' | 'good' | 'at_risk' | 'critical' {
  if (health >= 80) return 'excellent'
  if (health >= 60) return 'good'
  if (health >= 40) return 'at_risk'
  return 'critical'
}

/**
 * Calculate average task completion time (in days)
 */
export function calculateAvgTaskCompletionTime(tasks: Task[]): number {
  const completedTasks = tasks.filter(t => t.status === 'done' && t.completedAt)

  if (completedTasks.length === 0) return 0

  const totalDays = completedTasks.reduce((sum, task) => {
    const created = new Date(task.createdAt).getTime()
    const completed = new Date(task.completedAt!).getTime()
    const days = (completed - created) / (1000 * 60 * 60 * 24)
    return sum + days
  }, 0)

  return Math.round(totalDays / completedTasks.length)
}

/**
 * Export project analytics summary
 */
export function generateProjectAnalytics(project: Project, tasks: Task[], sprints: Sprint[]): ProjectAnalytics {
  const completedTasks = tasks.filter(t => t.status === 'done')
  const velocity = calculateTeamVelocity(sprints)

  return {
    projectId: project.id,
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    blockedTasks: getBlockedTasks(tasks).length,
    completionRate: calculateProjectCompletion(completedTasks.length, tasks.length),
    avgTaskCompletionTime: calculateAvgTaskCompletionTime(tasks),
    totalSprints: sprints.length,
    completedSprints: sprints.filter(s => s.status === 'completed').length,
    avgVelocity: velocity,
    budget: project.budget || 0,
    spent: project.spentAmount,
    budgetUtilization: project.budget ? calculateBudgetUtilization(project.spentAmount, project.budget) : 0,
    healthScore: calculateProjectHealth(project),
    tasksByStatus: [
      { status: 'backlog', count: getTasksByStatus(tasks, 'backlog').length },
      { status: 'todo', count: getTasksByStatus(tasks, 'todo').length },
      { status: 'in_progress', count: getTasksByStatus(tasks, 'in_progress').length },
      { status: 'in_review', count: getTasksByStatus(tasks, 'in_review').length },
      { status: 'done', count: getTasksByStatus(tasks, 'done').length },
      { status: 'blocked', count: getTasksByStatus(tasks, 'blocked').length }
    ]
  }
}
