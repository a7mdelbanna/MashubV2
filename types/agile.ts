/**
 * Consolidated Agile Type Definitions
 * Single source of truth for all agile/scrum entities
 * Implements Full Scrum methodology with Project → Epic → Story → Task hierarchy
 */

import { TeamMember } from './index'

// ============================================================================
// ENUMS & TYPE UNIONS
// ============================================================================

/**
 * Standard 5-level priority system
 * critical: Blocks production, requires immediate attention
 * urgent: Must be done same day/sprint
 * high: Important, schedule soon
 * medium: Normal priority
 * low: Nice to have
 */
export type Priority = 'critical' | 'urgent' | 'high' | 'medium' | 'low'

/**
 * Task status workflow (Full Scrum)
 * backlog: Not yet planned for sprint
 * todo: In sprint, ready to start
 * in_progress: Actively being worked on
 * in_review: Code review, QA, or stakeholder review
 * done: Meets Definition of Done
 * blocked: Cannot proceed due to dependency
 */
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked'

/**
 * Work item types
 */
export type WorkItemType = 'task' | 'bug' | 'feature' | 'improvement' | 'documentation' | 'spike'

/**
 * Epic status
 */
export type EpicStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled'

/**
 * Sprint status
 */
export type SprintStatus = 'planning' | 'active' | 'completed' | 'cancelled'

/**
 * Bug severity levels
 */
export type BugSeverity = 'critical' | 'major' | 'minor' | 'trivial'

/**
 * Dependency relationship types
 */
export type DependencyType = 'blocks' | 'is_blocked_by' | 'relates_to' | 'duplicates' | 'is_duplicated_by'

/**
 * Story size (T-shirt sizing)
 */
export type StorySize = 'xs' | 's' | 'm' | 'l' | 'xl'

// ============================================================================
// CUSTOM FIELDS
// ============================================================================

export type CustomFieldType = 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multi_select' | 'user'

export interface CustomFieldDefinition {
  id: string
  name: string
  type: CustomFieldType
  required: boolean
  options?: string[] // For select/multi_select
  defaultValue?: any
}

export interface CustomFieldValue {
  fieldId: string
  value: any
}

// ============================================================================
// DEPENDENCY MANAGEMENT
// ============================================================================

export interface Dependency {
  id: string
  fromWorkItemId: string
  toWorkItemId: string
  type: DependencyType
  createdAt: Date
  createdBy: string
}

// ============================================================================
// DEFINITION OF DONE
// ============================================================================

export interface DefinitionOfDoneItem {
  id: string
  description: string
  required: boolean
  order: number
}

export interface DefinitionOfDone {
  id: string
  name: string
  items: DefinitionOfDoneItem[]
  appliesTo: WorkItemType[]
}

// ============================================================================
// ACCEPTANCE CRITERIA
// ============================================================================

export interface AcceptanceCriteria {
  id: string
  description: string
  given?: string // Given-When-Then format
  when?: string
  then?: string
  completed: boolean
  completedAt?: Date
  completedBy?: string
}

// ============================================================================
// TIME TRACKING
// ============================================================================

export interface TimeEntry {
  id: string
  workItemId: string // Can be task, story, or epic
  userId: string
  userName: string
  duration: number // minutes
  description?: string
  date: Date
  billable: boolean
  hourlyRate?: number
}

export interface TimeEstimate {
  original: number // minutes
  remaining: number // minutes
  actual: number // minutes (rolled up from time entries)
  confidence: 'low' | 'medium' | 'high' // Estimation confidence
}

// ============================================================================
// TASK (Lowest level work item)
// ============================================================================

export interface Task {
  id: string
  projectId: string

  // Hierarchy (Full Scrum)
  storyId: string // Required - tasks must belong to a story
  epicId: string // Denormalized from story for easier querying
  sprintId?: string // Denormalized from story

  // Basic Info
  title: string
  description: string
  type: WorkItemType

  // Status & Priority
  status: TaskStatus
  priority: Priority

  // Assignment
  assigneeId?: string
  assigneeName?: string
  assigneeAvatar?: string
  reporterId: string
  reporterName?: string

  // Dependencies
  dependencies: Dependency[]
  blockedBy: string[] // Task IDs (denormalized for quick lookup)

  // Time & Estimates
  timeEstimate: TimeEstimate
  storyPoints?: number

  // Dates
  startDate?: Date
  dueDate?: Date
  completedAt?: Date

  // Organization
  tags: string[]
  labels: string[]

  // Activity
  commentsCount: number
  attachmentsCount: number
  watchers: string[] // User IDs watching this task

  // Checklist Integration
  checklistItemId?: string
  checklistInstanceId?: string

  // Definition of Done
  definitionOfDone?: DefinitionOfDone
  definitionOfDoneCompleted: boolean

  // Custom Fields
  customFields: CustomFieldValue[]

  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// ============================================================================
// BUG (Specialized Task)
// ============================================================================

export interface Bug extends Task {
  type: 'bug'

  // Bug-specific fields
  severity: BugSeverity
  reproductionSteps: string[]
  environment?: string
  affectedVersions: string[]
  fixedInVersion?: string
  rootCause?: string
  reopenCount: number
  verifiedBy?: string
  verifiedAt?: Date
}

// ============================================================================
// STORY (Collection of tasks)
// ============================================================================

export interface Story {
  id: string
  projectId: string

  // Hierarchy
  epicId: string // Required - stories must belong to an epic
  sprintId?: string // Required for Full Scrum when in active development

  // Basic Info
  title: string
  description: string
  userStory?: string // As a [user], I want [goal], so that [benefit]

  // Status & Priority
  status: TaskStatus
  priority: Priority

  // Assignment
  assigneeId?: string // Story owner
  assigneeName?: string

  // Children
  tasks: Task[]
  taskIds: string[] // Denormalized for quick lookup

  // Estimates
  storyPoints: number
  size: StorySize
  timeEstimate: TimeEstimate

  // Acceptance Criteria
  acceptanceCriteria: AcceptanceCriteria[]
  allCriteriaAccepted: boolean

  // Dates
  startDate?: Date
  dueDate?: Date
  completedAt?: Date

  // Progress
  tasksTotal: number
  tasksCompleted: number
  progress: number // 0-100

  // Organization
  tags: string[]
  labels: string[]

  // Custom Fields
  customFields: CustomFieldValue[]

  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// ============================================================================
// EPIC (Collection of stories)
// ============================================================================

export interface Epic {
  id: string
  projectId: string

  // Basic Info
  title: string
  description: string
  goal: string // What does this epic aim to achieve?

  // Status & Priority
  status: EpicStatus
  priority: Priority

  // Assignment
  ownerId?: string // Epic owner
  ownerName?: string

  // Children
  stories: Story[]
  storyIds: string[] // Denormalized

  // Estimates (rolled up from stories)
  totalStoryPoints: number
  completedStoryPoints: number

  // Dates
  startDate?: Date
  targetDate?: Date
  completedAt?: Date

  // Progress (rolled up from stories)
  storiesTotal: number
  storiesCompleted: number
  tasksTotal: number
  tasksCompleted: number
  progress: number // 0-100

  // Business Value
  businessValue?: number // 1-100 score
  roi?: number // Return on investment estimate

  // Organization
  tags: string[]
  labels: string[]

  // Custom Fields
  customFields: CustomFieldValue[]

  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// ============================================================================
// SPRINT (Time-boxed iteration)
// ============================================================================

export interface BurndownPoint {
  date: Date
  idealRemaining: number // Ideal remaining story points
  actualRemaining: number // Actual remaining story points
  completed: number // Story points completed that day
}

export interface SprintRetrospective {
  whatWentWell: string[]
  whatWentWrong: string[]
  actionItems: string[]
  conductedAt: Date
  conductedBy: string
  attendees: string[] // User IDs
}

export interface Sprint {
  id: string
  projectId: string

  // Basic Info
  name: string
  goal: string // Sprint goal
  number: number // Sprint sequence number

  // Status
  status: SprintStatus

  // Dates
  startDate: Date
  endDate: Date

  // Children
  stories: Story[]
  storyIds: string[] // Denormalized

  // Capacity & Planning
  teamCapacity: number // Total available hours
  committedPoints: number
  completedPoints: number

  // Team
  teamMembers: TeamMember[]
  teamMemberIds: string[]

  // Velocity & Burndown
  velocity: number // Completed points / sprint duration
  plannedVelocity: number // What was planned
  burndown: BurndownPoint[]

  // Definition of Done
  definitionOfDone: DefinitionOfDone

  // Retrospective
  retrospective?: SprintRetrospective

  // Metadata
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

// ============================================================================
// BACKLOG (Ordered list of work items)
// ============================================================================

export interface BacklogItem {
  id: string
  storyId: string
  order: number // For backlog ordering
  readyForSprint: boolean
  estimationConfidence: 'low' | 'medium' | 'high'
  lastGroomedAt?: Date
  lastGroomedBy?: string
}

export interface Backlog {
  id: string
  projectId: string
  items: BacklogItem[]

  // Backlog Health Metrics
  totalStoryPoints: number
  estimatedSprints: number // Based on average velocity
  readyItemsCount: number

  // Metadata
  lastGroomedAt?: Date
  updatedAt: Date
}

// ============================================================================
// BOARD (Kanban/Scrum Board)
// ============================================================================

export interface BoardColumn {
  id: string
  name: string
  status: TaskStatus
  wipLimit?: number // Work in Progress limit
  order: number
}

export interface BoardWorkflow {
  id: string
  name: string
  description?: string
  columns: BoardColumn[]
  transitions: BoardTransition[]
}

export interface BoardTransition {
  fromStatus: TaskStatus
  toStatus: TaskStatus
  requiredPermission?: string
  validation?: string // Function name or rule
}

export interface Board {
  id: string
  projectId: string
  name: string
  workflow: BoardWorkflow

  // Settings
  showSubtasks: boolean
  showBlockedTasks: boolean
  groupBy: 'none' | 'assignee' | 'epic' | 'priority'

  // Filters (saved board filters)
  savedFilters: BoardFilter[]
}

export interface BoardFilter {
  id: string
  name: string
  priority?: Priority[]
  assignee?: string[]
  epic?: string[]
  sprint?: string[]
  hasChecklist?: boolean
}

// ============================================================================
// VELOCITY & FORECASTING
// ============================================================================

export interface VelocityData {
  sprintId: string
  sprintName: string
  committed: number
  completed: number
  sprintNumber: number
  startDate: Date
  endDate: Date
}

export interface VelocityMetrics {
  average: number
  median: number
  trend: 'increasing' | 'decreasing' | 'stable'
  reliability: number // 0-100, how consistent is velocity
  historicalData: VelocityData[]
}

export interface Forecast {
  remainingStoryPoints: number
  averageVelocity: number
  estimatedSprints: number
  estimatedCompletionDate: Date
  confidence: 'low' | 'medium' | 'high'
}

// ============================================================================
// PROJECT AGILE METRICS (extends Project from main types)
// ============================================================================

export interface ProjectAgileMetrics {
  // Epics
  epicsTotal: number
  epicsCompleted: number
  epicsInProgress: number

  // Stories
  storiesTotal: number
  storiesCompleted: number
  storiesInBacklog: number

  // Tasks
  tasksTotal: number
  tasksCompleted: number
  tasksBugs: number
  tasksBlocked: number

  // Points
  totalStoryPoints: number
  completedStoryPoints: number

  // Velocity
  currentVelocity: number
  velocityMetrics: VelocityMetrics
  forecast: Forecast

  // Health
  sprintHealth: 'on_track' | 'at_risk' | 'behind'
  backlogHealth: 'healthy' | 'needs_grooming' | 'unhealthy'

  // Checklists
  checklistsTotal: number
  checklistsProductionReady: number
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type WorkItem = Task | Story | Epic

export interface WorkItemFilter {
  search?: string
  priority?: Priority[]
  status?: TaskStatus[]
  assignee?: string[]
  epic?: string[]
  sprint?: string[]
  type?: WorkItemType[]
  hasChecklist?: boolean
  isBlocked?: boolean
  isOverdue?: boolean
  createdAfter?: Date
  createdBefore?: Date
  customFields?: Record<string, any>
}
