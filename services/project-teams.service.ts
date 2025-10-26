/**
 * Project Teams Service
 *
 * Manages ProjectTeamMember entities in Firebase with multi-tenant support.
 *
 * Collection Path: tenants/{tenantId}/projects/{projectId}/team/{memberId}
 *
 * Features:
 * - Multi-tenant data isolation
 * - Real-time subscriptions
 * - Employee assignment tracking
 * - Allocation and capacity management
 * - Performance tracking
 * - Bi-directional sync with Employee.activeProjects
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  collectionGroup,
  QueryConstraint
} from 'firebase/firestore'
import { db } from '@/lib/firebase-config'
import { converters } from '@/lib/firebase-converters'
import type { ProjectTeamMember, Employee } from '@/types'
import { EmployeesService } from './employees.service'

/**
 * Get project team collection reference
 */
function getProjectTeamCollection(tenantId: string, projectId: string) {
  return collection(
    db,
    'tenants',
    tenantId,
    'projects',
    projectId,
    'team'
  ).withConverter(converters.projectTeamMember)
}

/**
 * Get team member document reference
 */
function getTeamMemberDoc(tenantId: string, projectId: string, memberId: string) {
  return doc(
    db,
    'tenants',
    tenantId,
    'projects',
    projectId,
    'team',
    memberId
  ).withConverter(converters.projectTeamMember)
}

/**
 * Validate team member data
 */
function validateTeamMemberData(data: Partial<ProjectTeamMember>): void {
  if (data.projectRole !== undefined && !data.projectRole.trim()) {
    throw new Error('Project role is required')
  }

  if (data.allocation !== undefined && (data.allocation < 0 || data.allocation > 100)) {
    throw new Error('Allocation must be between 0 and 100')
  }

  if (data.hoursPerWeek !== undefined && data.hoursPerWeek < 0) {
    throw new Error('Hours per week must be positive')
  }

  if (data.sprintCapacity !== undefined && data.sprintCapacity < 0) {
    throw new Error('Sprint capacity must be positive')
  }

  if (data.performanceScore !== undefined && (data.performanceScore < 1 || data.performanceScore > 5)) {
    throw new Error('Performance score must be between 1 and 5')
  }
}

/**
 * Team Query Options
 */
export interface TeamQueryOptions {
  employeeId?: string
  status?: ProjectTeamMember['status']
  orderByField?: keyof ProjectTeamMember
  orderDirection?: 'asc' | 'desc'
  limitCount?: number
}

/**
 * Create Team Member Data
 */
export interface CreateTeamMemberData {
  employeeId: string
  projectRole: string
  responsibilities?: string[]
  allocation: number
  hoursPerWeek: number
  sprintCapacity: number
  startDate: Date
  endDate?: Date
  status?: ProjectTeamMember['status']
  permissions?: string[]
}

/**
 * Update Team Member Data
 */
export interface UpdateTeamMemberData {
  projectRole?: string
  responsibilities?: string[]
  allocation?: number
  hoursPerWeek?: number
  sprintCapacity?: number
  startDate?: Date
  endDate?: Date
  status?: ProjectTeamMember['status']
  permissions?: string[]
  tasksAssigned?: number
  tasksCompleted?: number
  hoursLogged?: number
  performanceScore?: number
}

/**
 * Project Teams Service
 */
export const ProjectTeamsService = {
  /**
   * Add team member to project
   */
  async addMember(
    tenantId: string,
    projectId: string,
    projectName: string,
    data: CreateTeamMemberData,
    assignedBy: string
  ): Promise<ProjectTeamMember> {
    validateTeamMemberData(data)

    // Get employee data
    const employee = await EmployeesService.get(tenantId, data.employeeId)
    if (!employee) {
      throw new Error('Employee not found')
    }

    const teamRef = getProjectTeamCollection(tenantId, projectId)

    const now = new Date()
    const memberData: Omit<ProjectTeamMember, 'id'> = {
      projectId,
      employeeId: data.employeeId,

      employee: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
        avatar: employee.avatar,
        title: employee.title,
        department: employee.department
      },

      projectRole: data.projectRole,
      responsibilities: data.responsibilities,

      allocation: data.allocation,
      hoursPerWeek: data.hoursPerWeek,
      sprintCapacity: data.sprintCapacity,

      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || 'active',

      tasksAssigned: 0,
      tasksCompleted: 0,
      hoursLogged: 0,
      performanceScore: undefined,

      permissions: data.permissions || [],

      assignedAt: now,
      assignedBy,
      updatedAt: now,
      lastActiveAt: now
    }

    const docRef = await addDoc(teamRef, memberData as any)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Failed to add team member')
    }

    const teamMember = docSnap.data() as ProjectTeamMember

    // Update employee's activeProjects array
    await this.syncEmployeeActiveProjects(tenantId, data.employeeId)

    return teamMember
  },

  /**
   * Get team member by ID
   */
  async get(
    tenantId: string,
    projectId: string,
    memberId: string
  ): Promise<ProjectTeamMember | null> {
    const memberRef = getTeamMemberDoc(tenantId, projectId, memberId)
    const docSnap = await getDoc(memberRef)

    if (!docSnap.exists()) {
      return null
    }

    return docSnap.data() as ProjectTeamMember
  },

  /**
   * List team members for a project
   */
  async list(
    tenantId: string,
    projectId: string,
    options?: TeamQueryOptions
  ): Promise<ProjectTeamMember[]> {
    const teamRef = getProjectTeamCollection(tenantId, projectId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.employeeId) {
      constraints.push(where('employeeId', '==', options.employeeId))
    }

    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    // Add ordering
    if (options?.orderByField) {
      constraints.push(
        orderBy(options.orderByField, options.orderDirection || 'asc')
      )
    }

    // Add limit
    if (options?.limitCount) {
      constraints.push(limit(options.limitCount))
    }

    const q = constraints.length > 0 ? query(teamRef, ...constraints) : teamRef
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => doc.data() as ProjectTeamMember)
  },

  /**
   * Update team member
   */
  async update(
    tenantId: string,
    projectId: string,
    memberId: string,
    data: UpdateTeamMemberData
  ): Promise<void> {
    validateTeamMemberData(data)

    const memberRef = getTeamMemberDoc(tenantId, projectId, memberId)
    const updateData: any = {
      ...data,
      updatedAt: new Date()
    }

    await updateDoc(memberRef, updateData)

    // If allocation changed, sync employee activeProjects
    if (data.allocation !== undefined) {
      const currentSnap = await getDoc(memberRef)
      if (currentSnap.exists()) {
        const current = currentSnap.data() as ProjectTeamMember
        await this.syncEmployeeActiveProjects(tenantId, current.employeeId)
      }
    }
  },

  /**
   * Update team member status
   */
  async updateStatus(
    tenantId: string,
    projectId: string,
    memberId: string,
    status: ProjectTeamMember['status'],
    endDate?: Date
  ): Promise<void> {
    const memberRef = getTeamMemberDoc(tenantId, projectId, memberId)

    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (status === 'completed' && endDate) {
      updateData.endDate = endDate
    }

    await updateDoc(memberRef, updateData)

    // Sync employee activeProjects
    const currentSnap = await getDoc(memberRef)
    if (currentSnap.exists()) {
      const current = currentSnap.data() as ProjectTeamMember
      await this.syncEmployeeActiveProjects(tenantId, current.employeeId)
    }
  },

  /**
   * Update task counts for team member
   */
  async updateTaskCounts(
    tenantId: string,
    projectId: string,
    memberId: string,
    counts: {
      tasksAssigned?: number
      tasksCompleted?: number
    }
  ): Promise<void> {
    const memberRef = getTeamMemberDoc(tenantId, projectId, memberId)

    await updateDoc(memberRef, {
      ...counts,
      updatedAt: new Date(),
      lastActiveAt: new Date()
    })
  },

  /**
   * Log hours for team member
   */
  async logHours(
    tenantId: string,
    projectId: string,
    memberId: string,
    hours: number
  ): Promise<void> {
    const memberRef = getTeamMemberDoc(tenantId, projectId, memberId)
    const memberSnap = await getDoc(memberRef)

    if (!memberSnap.exists()) {
      throw new Error('Team member not found')
    }

    const member = memberSnap.data() as ProjectTeamMember
    const newTotal = (member.hoursLogged || 0) + hours

    await updateDoc(memberRef, {
      hoursLogged: newTotal,
      updatedAt: new Date(),
      lastActiveAt: new Date()
    })
  },

  /**
   * Remove team member from project
   */
  async removeMember(
    tenantId: string,
    projectId: string,
    memberId: string
  ): Promise<void> {
    const memberRef = getTeamMemberDoc(tenantId, projectId, memberId)
    const memberSnap = await getDoc(memberRef)

    if (memberSnap.exists()) {
      const member = memberSnap.data() as ProjectTeamMember
      await deleteDoc(memberRef)

      // Update employee's activeProjects array
      await this.syncEmployeeActiveProjects(tenantId, member.employeeId)
    }
  },

  /**
   * Get all projects for an employee (collection group query)
   */
  async getEmployeeProjects(
    tenantId: string,
    employeeId: string,
    statusFilter?: ProjectTeamMember['status']
  ): Promise<ProjectTeamMember[]> {
    const teamCollectionGroup = collectionGroup(db, 'team')
    const constraints: QueryConstraint[] = [
      where('employeeId', '==', employeeId)
    ]

    if (statusFilter) {
      constraints.push(where('status', '==', statusFilter))
    }

    constraints.push(orderBy('startDate', 'desc'))

    const q = query(teamCollectionGroup, ...constraints).withConverter(converters.projectTeamMember)
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => doc.data() as ProjectTeamMember)
  },

  /**
   * Get active team members for a project
   */
  async getActiveMembers(
    tenantId: string,
    projectId: string
  ): Promise<ProjectTeamMember[]> {
    return this.list(tenantId, projectId, {
      status: 'active',
      orderByField: 'assignedAt',
      orderDirection: 'asc'
    })
  },

  /**
   * Subscribe to team members with real-time updates
   */
  subscribe(
    tenantId: string,
    projectId: string,
    callback: (members: ProjectTeamMember[]) => void,
    options?: TeamQueryOptions
  ): () => void {
    const teamRef = getProjectTeamCollection(tenantId, projectId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.employeeId) {
      constraints.push(where('employeeId', '==', options.employeeId))
    }

    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    // Add ordering
    if (options?.orderByField) {
      constraints.push(
        orderBy(options.orderByField, options.orderDirection || 'asc')
      )
    }

    // Add limit
    if (options?.limitCount) {
      constraints.push(limit(options.limitCount))
    }

    const q = constraints.length > 0 ? query(teamRef, ...constraints) : teamRef

    return onSnapshot(q, snapshot => {
      const members = snapshot.docs.map(doc => doc.data() as ProjectTeamMember)
      callback(members)
    })
  },

  /**
   * Sync employee's activeProjects array (denormalized data)
   * This keeps Employee.activeProjects in sync with actual team assignments
   */
  async syncEmployeeActiveProjects(
    tenantId: string,
    employeeId: string
  ): Promise<void> {
    // Get all active project assignments for this employee
    const projects = await this.getEmployeeProjects(tenantId, employeeId, 'active')

    // Build activeProjects array
    const activeProjects: Employee['activeProjects'] = projects.map(p => ({
      projectId: p.projectId,
      projectName: '', // Will need to fetch from project if needed, or pass in
      role: p.projectRole,
      allocation: p.allocation
    }))

    // Update employee document
    await EmployeesService.updateActiveProjects(tenantId, employeeId, activeProjects)
  },

  /**
   * Calculate total allocation for an employee across all projects
   */
  async getEmployeeTotalAllocation(
    tenantId: string,
    employeeId: string
  ): Promise<number> {
    const projects = await this.getEmployeeProjects(tenantId, employeeId, 'active')
    return projects.reduce((total, p) => total + p.allocation, 0)
  },

  /**
   * Check if employee is available for assignment
   */
  async isEmployeeAvailable(
    tenantId: string,
    employeeId: string,
    requiredAllocation: number
  ): Promise<boolean> {
    const currentAllocation = await this.getEmployeeTotalAllocation(tenantId, employeeId)
    return (currentAllocation + requiredAllocation) <= 100
  }
}
