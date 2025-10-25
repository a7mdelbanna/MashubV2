// ==========================================
// PROJECT TYPES & INTERFACES
// ==========================================

export type ProjectStatus = 'draft' | 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'archived'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical'
export type ProjectVisibility = 'private' | 'team' | 'client' | 'public'

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type TaskType = 'task' | 'bug' | 'feature' | 'epic' | 'story'

export type SprintStatus = 'planning' | 'active' | 'completed' | 'cancelled'

export type MilestoneStatus = 'upcoming' | 'in_progress' | 'completed' | 'delayed'

export type DocumentCategory = 'requirement' | 'design' | 'technical' | 'meeting' | 'contract' | 'other'
export type DocumentStatus = 'draft' | 'review' | 'approved' | 'archived'

export type TeamRole = 'owner' | 'manager' | 'developer' | 'designer' | 'qa' | 'viewer'
export type TeamMemberStatus = 'active' | 'inactive' | 'invited'

export type VaultItemType = 'credential' | 'api_key' | 'certificate' | 'ssh_key' | 'license' | 'note'
export type VaultAccessLevel = 'owner' | 'admin' | 'write' | 'read'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface Project {
  id: string
  tenantId: string
  name: string
  slug: string
  description: string

  // Client & Business
  clientId?: string
  clientName?: string
  contractValue?: number
  currency?: string

  // Status & Dates
  status: ProjectStatus
  priority: ProjectPriority
  visibility: ProjectVisibility
  startDate?: string
  endDate?: string
  estimatedHours?: number
  actualHours?: number

  // Team
  ownerId: string
  ownerName?: string
  managerId?: string
  managerName?: string
  teamSize?: number

  // Progress
  completionPercentage: number
  tasksTotal: number
  tasksCompleted: number
  milestonesTotal: number
  milestonesCompleted: number

  // Budget
  budgetAllocated?: number
  budgetSpent?: number

  // Metadata
  tags: string[]
  color?: string
  iconUrl?: string

  // Timestamps
  createdAt: string
  updatedAt: string
  completedAt?: string
  archivedAt?: string
}

export interface Task {
  id: string
  tenantId: string
  projectId: string
  sprintId?: string
  epicId?: string

  // Basic Info
  title: string
  description: string
  type: TaskType

  // Status & Priority
  status: TaskStatus
  priority: TaskPriority

  // Assignment
  assigneeId?: string
  assigneeName?: string
  assigneeAvatar?: string
  reporterId: string
  reporterName?: string

  // Relationships
  parentTaskId?: string
  blockedBy: string[]
  relatedTasks: string[]

  // Estimates
  storyPoints?: number
  estimatedHours?: number
  actualHours?: number

  // Dates
  dueDate?: string
  startDate?: string
  completedAt?: string

  // Organization
  labels: string[]
  tags: string[]

  // Activity
  commentsCount: number
  attachmentsCount: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface Sprint {
  id: string
  tenantId: string
  projectId: string
  name: string
  goal: string

  status: SprintStatus

  startDate: string
  endDate: string

  // Capacity
  teamCapacity: number // total hours
  committedPoints: number
  completedPoints: number

  // Tasks
  taskIds: string[]
  tasksTotal: number
  tasksCompleted: number

  // Metrics
  velocity: number
  burndownData: BurndownPoint[]

  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface BurndownPoint {
  date: string
  remainingWork: number // story points or hours
  idealWork: number
}

export interface Milestone {
  id: string
  tenantId: string
  projectId: string
  name: string
  description: string

  status: MilestoneStatus

  dueDate: string
  completedAt?: string

  // Progress
  tasksTotal: number
  tasksCompleted: number
  completionPercentage: number

  // Dependencies
  dependsOn: string[] // other milestone IDs

  createdAt: string
  updatedAt: string
}

export interface ProjectDocument {
  id: string
  tenantId: string
  projectId: string

  title: string
  description: string
  category: DocumentCategory
  status: DocumentStatus

  // File Info
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string

  // Versioning
  version: string
  versionHistory: DocumentVersion[]

  // Access
  uploadedBy: string
  uploadedByName?: string
  accessLevel: 'public' | 'team' | 'restricted'
  allowedUserIds?: string[]

  // Metadata
  tags: string[]

  createdAt: string
  updatedAt: string
}

export interface DocumentVersion {
  version: string
  fileUrl: string
  uploadedBy: string
  uploadedAt: string
  changes: string
}

export interface TeamMember {
  id: string
  tenantId: string
  projectId: string
  userId: string

  // User Info
  name: string
  email: string
  avatar?: string

  // Role & Access
  role: TeamRole
  status: TeamMemberStatus

  // Capacity
  hoursPerWeek?: number
  availability?: number // percentage

  // Activity
  tasksAssigned: number
  tasksCompleted: number
  hoursLogged: number

  // Dates
  joinedAt: string
  leftAt?: string
  invitedAt?: string
  invitedBy?: string
}

export interface VaultItem {
  id: string
  tenantId: string
  projectId: string

  type: VaultItemType
  name: string
  description: string

  // Encrypted Data
  encryptedValue: string // encrypted credential/key

  // Metadata
  username?: string
  url?: string
  expiresAt?: string

  // Access Control
  accessLevel: VaultAccessLevel
  allowedUserIds: string[]
  allowedRoles: TeamRole[]

  // Activity
  lastAccessedAt?: string
  lastAccessedBy?: string
  accessCount: number

  // Organization
  tags: string[]
  category?: string

  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface ProjectTimeline {
  id: string
  tenantId: string
  projectId: string

  date: string
  type: 'milestone' | 'task' | 'sprint' | 'document' | 'team' | 'note'
  title: string
  description?: string

  // References
  entityId?: string // ID of related milestone/task/etc

  // User
  userId: string
  userName: string
  userAvatar?: string

  createdAt: string
}

export interface Board {
  id: string
  tenantId: string
  projectId: string
  name: string
  description?: string

  columns: BoardColumn[]

  // Settings
  isDefault: boolean
  workflowId?: string

  createdAt: string
  updatedAt: string
}

export interface BoardColumn {
  id: string
  name: string
  status: TaskStatus
  order: number
  taskLimit?: number // WIP limit
  color?: string
}

export interface Comment {
  id: string
  tenantId: string
  taskId: string
  parentId?: string // for threaded comments

  content: string

  userId: string
  userName: string
  userAvatar?: string

  // Attachments
  attachments: Attachment[]

  // Metadata
  isEdited: boolean
  isPinned: boolean

  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string

  uploadedBy: string
  uploadedAt: string
}

export interface TimeEntry {
  id: string
  tenantId: string
  projectId: string
  taskId?: string
  userId: string

  // Time
  startTime: string
  endTime?: string
  duration: number // minutes

  // Details
  description: string
  isBillable: boolean

  // Billing
  hourlyRate?: number
  amount?: number

  createdAt: string
  updatedAt: string
}

export interface ProjectAnalytics {
  projectId: string

  // Progress
  overallProgress: number
  tasksVelocity: number
  estimatedCompletion: string

  // Budget
  budgetUtilization: number
  costPerHour: number

  // Team
  teamUtilization: number
  avgTaskCompletionTime: number

  // Quality
  bugRate: number
  reopenRate: number

  // Timeline
  isOnTrack: boolean
  daysDelayed: number

  // Trends
  velocityTrend: number[] // last 6 sprints
  burndownChart: BurndownPoint[]
}
